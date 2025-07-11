// app/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Play,
  Shield,
  Globe,
  Zap,
  Award,
  TrendingUp,
  Clock,
  MessageCircle,
  Search,
  Filter,
  MapPin,
  ChevronRight,
  User,
  Mail,
  Phone,
  Heart,
  Target,
  Lightbulb
} from 'lucide-react';

// Types
interface Mentor {
  _id: string;
  displayName: string;
  bio: string;
  location: string;
  expertise: string[];
  languages: string[];
  rating?: number;
  totalSessions?: number;
  profilePicture?: string;
  hourlyRate?: number;
}

interface Stats {
  totalMentors: number;
  totalStudents: number;
  totalSessions: number;
  averageRating: number;
}

export default function HomePage() {
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load featured mentors
      const mentorsResponse = await fetch('/api/mentors/search?limit=6');
      if (mentorsResponse.ok) {
        const mentorsData = await mentorsResponse.json();
        setMentors(mentorsData.data || []);
      }

      // Load platform stats (mock data for now)
      setStats({
        totalMentors: 150,
        totalStudents: 2500,
        totalSessions: 12000,
        averageRating: 4.8
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedExpertise) params.append('expertise', selectedExpertise);
    
    router.push(`/mentors?${params.toString()}`);
  };

  const featuredExpertise = [
    'Programming', 'Data Science', 'Business', 'Design', 'Marketing', 
    'Finance', 'Languages', 'Mathematics', 'Science', 'Engineering'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold gradient-text font-baskervville">
                MentorMatch
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How it Works
                </a>
                <a href="#mentors" className="text-muted-foreground hover:text-foreground transition-colors">
                  Find Mentors
                </a>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/auth/register')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold font-baskervville leading-tight">
                  Learn from the{' '}
                  <span className="gradient-text">Best Mentors</span>{' '}
                  in the World
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Connect with expert mentors, accelerate your learning, and achieve your goals 
                  with personalized guidance from industry professionals.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/auth/register?role=student')}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => router.push('/auth/register?role=mentor')}
                  className="border border-border px-8 py-4 rounded-lg text-lg font-semibold hover:bg-muted transition-colors"
                >
                  Become a Mentor
                </button>
              </div>

              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-montserrat">
                      {stats.totalMentors}+
                    </div>
                    <div className="text-sm text-muted-foreground">Expert Mentors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-montserrat">
                      {stats.totalStudents.toLocaleString()}+
                    </div>
                    <div className="text-sm text-muted-foreground">Active Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-montserrat">
                      {stats.totalSessions.toLocaleString()}+
                    </div>
                    <div className="text-sm text-muted-foreground">Sessions Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-montserrat">
                      {stats.averageRating}⭐
                    </div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <div className="glass-effect rounded-2xl p-8 border">
                <h3 className="text-2xl font-semibold mb-6 font-baskervville">Find Your Perfect Mentor</h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="What do you want to learn?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <select
                    value={selectedExpertise}
                    onChange={(e) => setSelectedExpertise(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select expertise area</option>
                    {featuredExpertise.map(expertise => (
                      <option key={expertise} value={expertise}>{expertise}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={handleSearch}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Find Mentors
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-baskervville mb-4">
              How MentorMatch Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Getting started with personalized mentoring is simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-baskervville">Find Your Mentor</h3>
              <p className="text-muted-foreground">
                Browse through our curated list of expert mentors and find the perfect match for your learning goals.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-baskervville">Book a Session</h3>
              <p className="text-muted-foreground">
                Schedule one-on-one sessions at your convenience. Choose from video calls, audio calls, or chat sessions.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-baskervville">Achieve Your Goals</h3>
              <p className="text-muted-foreground">
                Get personalized guidance, accelerate your learning, and achieve your goals faster than ever before.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      <section id="mentors" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-baskervville mb-4">
              Featured Mentors
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn from industry experts who are passionate about sharing their knowledge
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                  <div className="w-16 h-16 bg-muted rounded-full mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mentors.map((mentor) => (
                <div key={mentor._id} className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold font-baskervville">{mentor.displayName}</h3>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{mentor.location}</span>
                      </div>
                      {mentor.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                          {mentor.totalSessions && (
                            <span className="text-sm text-muted-foreground">
                              ({mentor.totalSessions} sessions)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {mentor.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <span className="bg-muted px-2 py-1 rounded text-xs">
                        +{mentor.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {mentor.hourlyRate && (
                      <span className="text-lg font-semibold text-primary">
                        ${mentor.hourlyRate}/hr
                      </span>
                    )}
                    <button
                      onClick={() => router.push(`/mentors/${mentor._id}`)}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90 transition-colors flex items-center space-x-1"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/mentors')}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              View All Mentors
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-baskervville mb-4">
              Why Choose MentorMatch?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide the best platform for meaningful mentor-student connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-baskervville">Verified Mentors</h3>
              <p className="text-muted-foreground">
                All our mentors go through a rigorous verification process to ensure quality and expertise.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-baskervville">Flexible Scheduling</h3>
              <p className="text-muted-foreground">
                Book sessions at your convenience with mentors across different time zones.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-baskervville">Multiple Formats</h3>
              <p className="text-muted-foreground">
                Choose from video calls, audio sessions, or text-based mentoring based on your preference.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-baskervville">Quality Assured</h3>
              <p className="text-muted-foreground">
                Our rating system and feedback mechanism ensure high-quality mentoring experiences.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-baskervville">Global Reach</h3>
              <p className="text-muted-foreground">
                Connect with mentors from around the world and learn from diverse perspectives.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-baskervville">Instant Booking</h3>
              <p className="text-muted-foreground">
                Book sessions instantly or schedule them in advance with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-baskervville mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of learners who are already achieving their goals with expert mentors.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/register?role=student')}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Find a Mentor</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push('/auth/register?role=mentor')}
              className="border border-border px-8 py-4 rounded-lg text-lg font-semibold hover:bg-muted transition-colors"
            >
              Become a Mentor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold gradient-text font-baskervville">MentorMatch</h3>
              <p className="text-muted-foreground text-sm">
                Connecting learners with expert mentors to accelerate growth and achieve goals.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="w-8 h-8 bg-muted rounded-full"></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Find Mentors</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Become a Mentor</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 MentorMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}