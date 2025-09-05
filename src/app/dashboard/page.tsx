"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  status: "draft" | "completed" | "published";
  thumbnail: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  features: string[];
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "E-Commerce App",
      description: "Mobile shopping application with cart and checkout",
      lastModified: "2 hours ago",
      status: "draft",
      thumbnail: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/03a5e0b1-5002-4d7a-a14a-0a55e25a5a8b.png"
    },
    {
      id: "2", 
      name: "Weather Dashboard",
      description: "Weather forecasting app with location services",
      lastModified: "1 day ago",
      status: "completed",
      thumbnail: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3a2fc0a8-ae67-4c57-b58b-6b969c385293.png"
    },
    {
      id: "3",
      name: "Task Manager",
      description: "Productivity app for managing daily tasks and projects",
      lastModified: "3 days ago", 
      status: "published",
      thumbnail: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8b359c04-ca2c-4041-b08c-c546853f5798.png"
    }
  ]);

  const [templates] = useState<Template[]>([
    {
      id: "t1",
      name: "Social Media App",
      description: "Complete social networking app with posts, messaging, and profiles",
      category: "Social",
      thumbnail: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6f3a7c2d-f3e6-4d56-9767-8db829e7d10a.png",
      features: ["User Authentication", "Post Feed", "Direct Messaging", "Profile Management"]
    },
    {
      id: "t2",
      name: "Food Delivery",
      description: "Restaurant and food delivery app with ordering system",
      category: "Business",
      thumbnail: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/406ba795-1ebd-455b-ab86-6c1cae729450.png",
      features: ["Restaurant Listings", "Menu Browser", "Cart System", "Order Tracking"]
    },
    {
      id: "t3",
      name: "Fitness Tracker",
      description: "Health and fitness app with workout tracking and analytics",
      category: "Health",
      thumbnail: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f5fa8dbd-f7ac-455e-a484-11c5fef42810.png",
      features: ["Workout Logging", "Progress Analytics", "Goal Setting", "Exercise Library"]
    },
    {
      id: "t4",
      name: "News Reader",
      description: "News aggregation app with categories and offline reading",
      category: "News",
      thumbnail: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9f6551f4-44b4-4035-8659-b693611a36d5.png",
      features: ["Article Feed", "Category Filter", "Offline Reading", "Bookmark System"]
    }
  ]);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateProject = () => {
    if (!newProjectName) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDescription || "New Android app project",
      lastModified: "Just now",
      status: "draft",
      thumbnail: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e238ee32-104f-4321-8655-5e70e787230e.png"
    };

    setProjects([newProject, ...projects]);
    setNewProjectName("");
    setNewProjectDescription("");
    setIsCreateDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";  
      case "published": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 md:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">AndroidBuilder</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">View Documentation</Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Create New App</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Android App</DialogTitle>
                    <DialogDescription>
                      Start building your Android app with AI assistance. Give your project a name and description.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="Enter your app name..."
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-description">Description (Optional)</Label>
                      <Input
                        id="project-description"
                        placeholder="Describe what your app will do..."
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject} disabled={!newProjectName}>
                      Create Project
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 md:px-12 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Manage your Android app projects and explore AI-powered templates.
          </p>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="projects">My Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {projects.length === 0 ? (
              <Card className="p-12 text-center">
                <CardContent>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-6">Create your first Android app to get started with AI-powered development.</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Create Your First App
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href={`/builder/${project.id}`}>
                      <CardHeader className="p-0">
                        <img 
                          src={project.thumbnail} 
                          alt={`${project.name} - ${project.description}`}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription className="mb-4">
                          {project.description}
                        </CardDescription>
                        <div className="text-sm text-gray-500">
                          Last modified {project.lastModified}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered App Templates</h2>
              <p className="text-gray-600">
                Start with professionally designed templates and customize them with AI assistance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <img 
                      src={template.thumbnail} 
                      alt={`${template.name} template - ${template.description}`}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <CardDescription className="mb-4">
                      {template.description}
                    </CardDescription>
                    <div className="space-y-2 mb-4">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Link href={`/builder/template/${template.id}`}>
                      <Button className="w-full" variant="outline">
                        Use Template
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}