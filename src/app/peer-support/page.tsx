"use client";

import { useState } from "react";
import Link from "next/link";

import { Users, TrendingUp, MessageSquare, Star, Shield, Eye, Volume2, Accessibility, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Community {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: any;
  color: string;
  memberCount: number;
  onlineCount: number;
  isSpecialized: boolean;
  trending?: boolean;
  accessibilitySupport?: string[];
}

const COMMUNITIES: Community[] = [
  {
    id: "general",
    name: "r/GeneralSupport",
    displayName: "General Support",
    description: "A supportive community for all students to share experiences and help each other",
    icon: Users,
    color: "text-blue-600",
    memberCount: 12543,
    onlineCount: 234,
    isSpecialized: false,
    trending: true
  },
  {
    id: "mental-wellness",
    name: "r/MentalWellness",
    displayName: "Mental Wellness",
    description: "Mental health support, coping strategies, and wellness resources",
    icon: Heart,
    color: "text-red-600",
    memberCount: 3247,
    onlineCount: 89,
    isSpecialized: true,
    trending: true,
    accessibilitySupport: ["Crisis support", "Peer counseling", "Wellness resources"]
  },
  {
    id: "learning-differences",
    name: "r/LearningDifferences",
    displayName: "Learning Differences",
    description: "Support for neurodiverse learners, ADHD, autism, dyslexia, and other learning differences",
    icon: BookOpen,
    color: "text-pink-600",
    memberCount: 1834,
    onlineCount: 67,
    isSpecialized: true,
    accessibilitySupport: ["Learning strategies", "Study accommodations", "Time management tools"]
  },
  {
    id: "visual-impaired",
    name: "r/VisionSupport",
    displayName: "Vision Support",
    description: "Community for students with visual impairments - screen readers, accessibility tools, and navigation",
    icon: Eye,
    color: "text-purple-600",
    memberCount: 892,
    onlineCount: 23,
    isSpecialized: true,
    accessibilitySupport: ["Screen reader compatible", "High contrast support", "Audio descriptions"]
  },
  {
    id: "mobility-support",
    name: "r/MobilitySupport",
    displayName: "Mobility Support",
    description: "Support for students with mobility challenges - campus accessibility and adaptive resources",
    icon: Accessibility,
    color: "text-orange-600",
    memberCount: 743,
    onlineCount: 15,
    isSpecialized: true,
    accessibilitySupport: ["Campus accessibility info", "Transportation support", "Adaptive resources"]
  },
  {
    id: "hearing-impaired",
    name: "r/HearingSupport",
    displayName: "Hearing Support",
    description: "Community for students with hearing impairments - sign language, captions, and communication",
    icon: Volume2,
    color: "text-green-600",
    memberCount: 654,
    onlineCount: 18,
    isSpecialized: true,
    accessibilitySupport: ["Sign language support", "Visual indicators", "Captions available"]
  }
];

export default function PeerSupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const filteredCommunities = COMMUNITIES.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "specialized") return matchesSearch && community.isSpecialized;
    if (activeTab === "trending") return matchesSearch && community.trending;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <BackButton to="/dashboard" />
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Student Support Communities</h1>
          <p className="text-muted-foreground">
            Join specialized communities designed for your unique needs. Connect with fellow students,
            share experiences, and find the support you deserve in safe, moderated environments.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Communities</TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="w-4 h-4 mr-1" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="specialized">
            <Shield className="w-4 h-4 mr-1" />
            Specialized
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map((community) => (
              <div key={community.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card dark:bg-gray-900 border border-border dark:border-gray-800 shadow-sm rounded-[32px] overflow-hidden flex flex-col">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-[20px] shadow-sm ${community.id === 'general' ? 'bg-blue-50 dark:bg-blue-900/20' : community.id === 'mental-wellness' ? 'bg-red-50 dark:bg-red-900/20' : community.id === 'learning-differences' ? 'bg-pink-50 dark:bg-pink-900/20' : community.id === 'visual-impaired' ? 'bg-purple-50 dark:bg-purple-900/20' : community.id === 'mobility-support' ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                        <community.icon className={`w-8 h-8 ${community.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-emerald-500 transition-colors">
                          {community.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {community.isSpecialized && (
                            <div className="px-2 py-0.5 bg-muted dark:bg-gray-800 text-muted-foreground dark:text-gray-300 text-xs font-semibold rounded-full">
                              Specialized
                            </div>
                          )}
                          {community.trending && (
                            <div className="flex items-center px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 flex-1 flex flex-col space-y-4">
                  <p className="text-sm text-muted-foreground dark:text-gray-400 font-medium leading-relaxed">
                    {community.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground dark:text-gray-300 bg-background dark:bg-gray-800/50 p-3 rounded-2xl w-fit">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{formatNumber(community.memberCount)}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>{community.onlineCount} online</span>
                    </div>
                  </div>

                  {community.accessibilitySupport && (
                    <div className="space-y-2 mt-auto">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Features</p>
                      <div className="flex flex-wrap gap-1.5">
                        {community.accessibilitySupport.slice(0, 2).map((support) => (
                          <div key={support} className="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 text-[11px] font-semibold rounded-lg border border-emerald-100/50">
                            {support}
                          </div>
                        ))}
                        {community.accessibilitySupport.length > 2 && (
                          <div className="px-2 py-1 bg-background text-muted-foreground dark:bg-gray-800 dark:text-gray-400 text-[11px] font-semibold rounded-lg border border-border">
                            +{community.accessibilitySupport.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 mt-2">
                  <div className="flex gap-3">
                    <Link href={`/community/${community.id}`} className="flex-1">
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all h-11">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Join Community
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-11 h-11 rounded-xl border-border dark:border-gray-800 hover:bg-background dark:hover:bg-gray-800 p-0">
                      <Star className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No communities found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or browse all communities.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Featured Section */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-lg" style={{ borderRadius: '16px' }}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">New to Student Support Communities?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our communities are safe spaces designed to provide support, resources, and connections for students 
              with diverse needs. Each community has dedicated moderators and accessibility features.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge className="bg-emerald-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">Safe & Moderated</Badge>
              <Badge className="bg-blue-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">Anonymous Options</Badge>
              <Badge className="bg-purple-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">Accessibility First</Badge>
              <Badge className="bg-orange-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">Peer Support</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}