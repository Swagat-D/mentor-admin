// app/api/admin/users/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Get all matching users
    const users = await usersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .project({ passwordHash: 0, otpCode: 0, passwordResetOTP: 0 })
      .toArray();

    if (format === 'csv') {
      return generateCSV(users);
    } else if (format === 'json') {
      return generateJSON(users);
    } else if (format === 'excel') {
      return generateExcel(users);
    }

    return NextResponse.json(
      { success: false, message: 'Unsupported format' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Export users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

function generateCSV(users: any[]) {
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Email',
    'Role',
    'Active',
    'Verified',
    'Created At',
    'Last Login'
  ];

  const csvContent = [
    headers.join(','),
    ...users.map(user => [
      user._id,
      `"${user.firstName}"`,
      `"${user.lastName}"`,
      `"${user.email}"`,
      user.role,
      user.isActive ? 'Yes' : 'No',
      user.isVerified ? 'Yes' : 'No',
      new Date(user.createdAt).toLocaleDateString(),
      user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'
    ].join(','))
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

function generateJSON(users: any[]) {
  const jsonContent = JSON.stringify({
    exportDate: new Date().toISOString(),
    totalUsers: users.length,
    users: users.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt || null
    }))
  }, null, 2);

  return new NextResponse(jsonContent, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.json"`,
    },
  });
}

function generateExcel(users: any[]) {
  // For Excel format, we'll generate a simple XML format that Excel can read
  const xlsContent = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Users">
  <Table>
   <Row>
    <Cell><Data ss:Type="String">ID</Data></Cell>
    <Cell><Data ss:Type="String">First Name</Data></Cell>
    <Cell><Data ss:Type="String">Last Name</Data></Cell>
    <Cell><Data ss:Type="String">Email</Data></Cell>
    <Cell><Data ss:Type="String">Role</Data></Cell>
    <Cell><Data ss:Type="String">Active</Data></Cell>
    <Cell><Data ss:Type="String">Verified</Data></Cell>
    <Cell><Data ss:Type="String">Created At</Data></Cell>
    <Cell><Data ss:Type="String">Last Login</Data></Cell>
   </Row>
   ${users.map(user => `
   <Row>
    <Cell><Data ss:Type="String">${user._id}</Data></Cell>
    <Cell><Data ss:Type="String">${user.firstName}</Data></Cell>
    <Cell><Data ss:Type="String">${user.lastName}</Data></Cell>
    <Cell><Data ss:Type="String">${user.email}</Data></Cell>
    <Cell><Data ss:Type="String">${user.role}</Data></Cell>
    <Cell><Data ss:Type="String">${user.isActive ? 'Yes' : 'No'}</Data></Cell>
    <Cell><Data ss:Type="String">${user.isVerified ? 'Yes' : 'No'}</Data></Cell>
    <Cell><Data ss:Type="String">${new Date(user.createdAt).toLocaleDateString()}</Data></Cell>
    <Cell><Data ss:Type="String">${user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}</Data></Cell>
   </Row>`).join('')}
  </Table>
 </Worksheet>
</Workbook>`;

  return new NextResponse(xlsContent, {
    headers: {
      'Content-Type': 'application/vnd.ms-excel',
      'Content-Disposition': `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.xls"`,
    },
  });
}