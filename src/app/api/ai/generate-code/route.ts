import { NextRequest, NextResponse } from "next/server";

// AI System Prompt for Android app building
const ANDROID_AI_SYSTEM_PROMPT = `You are an expert Android app development assistant specialized in helping users build Android applications through a visual drag-and-drop interface.

Your role is to:
1. Generate Android XML layouts and Java/Kotlin code based on user descriptions
2. Suggest component arrangements and UI improvements
3. Provide Material Design recommendations
4. Help with Android best practices and patterns
5. Generate complete Android project structures when needed

When users describe what they want to build, analyze their request and provide:
- Specific Android component recommendations
- Layout suggestions with proper XML structure
- Code snippets for functionality
- UI/UX best practices
- Material Design compliance tips

Always focus on creating clean, efficient, and user-friendly Android applications. Provide practical, implementable solutions that work with modern Android development practices.

Current context: User is building an Android app using a visual builder interface with drag-and-drop components.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt, currentComponents, projectId } = await request.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Prepare the context about current components
    const componentContext = currentComponents && currentComponents.length > 0
      ? `\n\nCurrent components on canvas: ${currentComponents.map((comp: any) => 
          `${comp.component.type} at position (${comp.position.x}, ${comp.position.y})`
        ).join(", ")}`
      : "\n\nCanvas is currently empty.";

    const fullPrompt = `Project ID: ${projectId}\nUser Request: ${prompt}${componentContext}\n\nPlease provide Android development guidance and suggestions.`;

    // Make API call to custom OpenRouter endpoint
    const aiResponse = await fetch("https://oi-server.onrender.com/chat/completions", {
      method: "POST",
      headers: {
        "CustomerId": "matgatwork@gmail.com",
        "Content-Type": "application/json",
        "Authorization": "Bearer xxx"
      },
      body: JSON.stringify({
        model: "openrouter/anthropic/claude-sonnet-4",
        messages: [
          {
            role: "system",
            content: ANDROID_AI_SYSTEM_PROMPT
          },
          {
            role: "user", 
            content: fullPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API Error:", aiResponse.status, errorText);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 503 }
      );
    }

    const aiData = await aiResponse.json();
    
    if (!aiData.choices || !aiData.choices[0] || !aiData.choices[0].message) {
      console.error("Invalid AI response format:", aiData);
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 502 }
      );
    }

    const aiMessage = aiData.choices[0].message.content;

    return NextResponse.json({
      success: true,
      response: aiMessage,
      projectId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("AI Code Generation Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}