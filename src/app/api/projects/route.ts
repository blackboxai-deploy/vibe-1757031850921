import { NextRequest, NextResponse } from "next/server";

// In a real application, this would be stored in a database
// For demo purposes, we'll use in-memory storage
let projects: any[] = [
  {
    id: "1",
    name: "E-Commerce App",
    description: "Mobile shopping application with cart and checkout",
    created: new Date("2024-01-15").toISOString(),
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: "draft",
    components: [],
    settings: {
      theme: "material",
      targetSdk: "34",
      minSdk: "21"
    }
  },
  {
    id: "2", 
    name: "Weather Dashboard",
    description: "Weather forecasting app with location services",
    created: new Date("2024-01-14").toISOString(),
    lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: "completed",
    components: [],
    settings: {
      theme: "material",
      targetSdk: "34",
      minSdk: "23"
    }
  },
  {
    id: "3",
    name: "Task Manager",
    description: "Productivity app for managing daily tasks and projects",
    created: new Date("2024-01-12").toISOString(),
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: "published",
    components: [],
    settings: {
      theme: "material",
      targetSdk: "34", 
      minSdk: "21"
    }
  }
];

// GET /api/projects - Fetch all projects
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      projects: projects.map(project => ({
        ...project,
        componentCount: project.components?.length || 0
      }))
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const newProject = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description?.trim() || "New Android app project",
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: "draft",
      components: [],
      settings: {
        theme: "material",
        targetSdk: "34",
        minSdk: "21",
        packageName: `com.androidbuilder.${name.toLowerCase().replace(/\s+/g, '')}`,
        versionCode: "1",
        versionName: "1.0.0"
      }
    };

    projects.unshift(newProject);

    return NextResponse.json({
      success: true,
      project: {
        ...newProject,
        componentCount: 0
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects - Update a project
export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, status, components, settings } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Update project with provided fields
    const updatedProject = {
      ...projects[projectIndex],
      ...(name && { name: name.trim() }),
      ...(description !== undefined && { description: description?.trim() || "" }),
      ...(status && { status }),
      ...(components && { components }),
      ...(settings && { settings: { ...projects[projectIndex].settings, ...settings } }),
      lastModified: new Date().toISOString()
    };

    projects[projectIndex] = updatedProject;

    return NextResponse.json({
      success: true,
      project: {
        ...updatedProject,
        componentCount: updatedProject.components?.length || 0
      }
    });

  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const deletedProject = projects.splice(projectIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: `Project "${deletedProject.name}" deleted successfully`
    });

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}