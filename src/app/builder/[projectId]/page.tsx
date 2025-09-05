"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useParams } from "next/navigation";

interface AndroidComponent {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  icon: string;
  properties: { [key: string]: any };
}

interface CanvasComponent {
  id: string;
  component: AndroidComponent;
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: { [key: string]: any };
}

export default function AppBuilder() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [selectedComponent, setSelectedComponent] = useState<CanvasComponent | null>(null);
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const androidComponents: AndroidComponent[] = [
    {
      id: "button",
      name: "Button",
      type: "Button",
      category: "Basic",
      description: "Standard Android button component",
      icon: "🔘",
      properties: {
        text: "Button",
        backgroundColor: "#2196F3",
        textColor: "#FFFFFF",
        cornerRadius: "4dp"
      }
    },
    {
      id: "textview",
      name: "TextView",
      type: "TextView",
      category: "Basic", 
      description: "Text display component",
      icon: "📝",
      properties: {
        text: "Sample Text",
        textSize: "16sp",
        textColor: "#000000",
        gravity: "left"
      }
    },
    {
      id: "edittext",
      name: "EditText",
      type: "EditText",
      category: "Input",
      description: "Text input field",
      icon: "✏️",
      properties: {
        hint: "Enter text...",
        textSize: "16sp",
        inputType: "text",
        maxLines: "1"
      }
    },
    {
      id: "imageview", 
      name: "ImageView",
      type: "ImageView",
      category: "Media",
      description: "Image display component",
      icon: "🖼️",
      properties: {
        scaleType: "centerCrop",
        width: "100dp",
        height: "100dp"
      }
    },
    {
      id: "recyclerview",
      name: "RecyclerView", 
      type: "RecyclerView",
      category: "Lists",
      description: "Scrollable list component",
      icon: "📋",
      properties: {
        orientation: "vertical",
        hasFixedSize: "true",
        layoutManager: "LinearLayoutManager"
      }
    },
    {
      id: "cardview",
      name: "CardView",
      type: "CardView", 
      category: "Layout",
      description: "Material Design card container",
      icon: "🗂️",
      properties: {
        cardElevation: "4dp",
        cardCornerRadius: "8dp",
        cardUseCompatPadding: "true"
      }
    },
    {
      id: "fab",
      name: "FloatingActionButton",
      type: "FloatingActionButton",
      category: "Material",
      description: "Material Design floating action button", 
      icon: "➕",
      properties: {
        fabSize: "normal",
        backgroundTint: "#FF4081",
        elevation: "6dp"
      }
    },
    {
      id: "switch",
      name: "Switch",
      type: "Switch",
      category: "Input",
      description: "Toggle switch component",
      icon: "🔄",
      properties: {
        checked: "false",
        text: "Enable feature",
        thumbTint: "#2196F3"
      }
    }
  ];

  const handleDragStart = (e: React.DragEvent, component: AndroidComponent) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData("component");
    if (!componentData) return;

    const component: AndroidComponent = JSON.parse(componentData);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newCanvasComponent: CanvasComponent = {
      id: `${component.id}_${Date.now()}`,
      component,
      position: { x, y },
      size: { width: 120, height: 40 },
      properties: { ...component.properties }
    };

    setCanvasComponents([...canvasComponents, newCanvasComponent]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleComponentClick = (canvasComponent: CanvasComponent) => {
    setSelectedComponent(canvasComponent);
  };

  const updateComponentProperty = (key: string, value: any) => {
    if (!selectedComponent) return;

    const updatedComponents = canvasComponents.map(comp =>
      comp.id === selectedComponent.id
        ? { ...comp, properties: { ...comp.properties, [key]: value } }
        : comp
    );

    setCanvasComponents(updatedComponents);
    setSelectedComponent({
      ...selectedComponent,
      properties: { ...selectedComponent.properties, [key]: value }
    });
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    setAiResponse("");

    try {
      const response = await fetch("/api/ai/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          currentComponents: canvasComponents,
          projectId
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAiResponse(data.response);
        // Apply AI suggestions to canvas if provided
        if (data.components) {
          setCanvasComponents(data.components);
        }
      } else {
        setAiResponse(`Error: ${data.error || "Failed to generate code"}`);
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiResponse("Error: Failed to connect to AI service");
    } finally {
      setIsGenerating(false);
    }
  };

  const componentsByCategory = androidComponents.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {} as { [key: string]: AndroidComponent[] });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
              <span className="font-semibold">AndroidBuilder</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm text-gray-600">Project: {projectId}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Preview</Button>
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm">Save</Button>
          </div>
        </div>
      </div>

      {/* Component Library Sidebar */}
      <div className="w-80 bg-white border-r pt-16 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 mb-2">Component Library</h2>
          <p className="text-sm text-gray-600">Drag components to the canvas</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {Object.entries(componentsByCategory).map(([category, components]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-700 mb-2">{category}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {components.map((component) => (
                    <Card
                      key={component.id}
                      className="p-3 cursor-grab hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, component)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{component.icon}</div>
                        <div className="text-xs font-medium text-gray-900">{component.name}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* AI Assistant */}
        <div className="border-t p-4">
          <h3 className="font-semibold text-gray-900 mb-2">AI Assistant</h3>
          <Textarea
            placeholder="Describe what you want to build... e.g., 'Create a login screen with email and password fields'"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="mb-2"
            rows={3}
          />
          <Button 
            onClick={handleAIGenerate}
            disabled={isGenerating || !aiPrompt.trim()}
            className="w-full"
            size="sm"
          >
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>
          {aiResponse && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
              {aiResponse}
            </div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 pt-16">
        <div className="h-full flex flex-col">
          <div className="flex-1 p-6">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <div
                  ref={canvasRef}
                  className="relative w-full h-full bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  style={{ minHeight: "600px" }}
                >
                  {/* Phone Frame */}
                  <div className="absolute inset-4 bg-gray-900 rounded-2xl p-2">
                    <div className="w-full h-full bg-white rounded-xl relative overflow-hidden">
                      {/* Status Bar */}
                      <div className="h-6 bg-gray-100 flex items-center justify-between px-4 text-xs text-gray-600">
                        <span>9:41 AM</span>
                        <span>100%</span>
                      </div>

                      {/* App Content Area */}
                      <div className="relative h-full bg-white">
                        {canvasComponents.length === 0 ? (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📱</div>
                              <p className="text-sm">Drag components here to build your app</p>
                            </div>
                          </div>
                        ) : (
                          canvasComponents.map((canvasComp) => (
                            <div
                              key={canvasComp.id}
                              className={`absolute cursor-pointer border-2 transition-all ${
                                selectedComponent?.id === canvasComp.id
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-transparent hover:border-gray-300"
                              }`}
                              style={{
                                left: canvasComp.position.x,
                                top: canvasComp.position.y,
                                width: canvasComp.size.width,
                                height: canvasComp.size.height
                              }}
                              onClick={() => handleComponentClick(canvasComp)}
                            >
                              <div className="w-full h-full flex items-center justify-center text-xs bg-white rounded shadow-sm">
                                <span className="mr-1">{canvasComp.component.icon}</span>
                                {canvasComp.component.type === "TextView" && canvasComp.properties.text}
                                {canvasComp.component.type === "Button" && canvasComp.properties.text}
                                {canvasComp.component.type === "EditText" && canvasComp.properties.hint}
                                {canvasComp.component.type === "ImageView" && "Image"}
                                {canvasComp.component.type === "RecyclerView" && "List"}
                                {canvasComp.component.type === "CardView" && "Card"}
                                {canvasComp.component.type === "FloatingActionButton" && "+"}
                                {canvasComp.component.type === "Switch" && "Switch"}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white border-l pt-16">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 mb-1">Properties</h2>
          <p className="text-sm text-gray-600">
            {selectedComponent ? `Editing ${selectedComponent.component.name}` : "Select a component to edit"}
          </p>
        </div>

        <ScrollArea className="h-full">
          <div className="p-4">
            {selectedComponent ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Component Type</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedComponent.component.type}</Badge>
                  </div>
                </div>

                <Separator />

                {Object.entries(selectedComponent.properties).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium">{key}</Label>
                    {typeof value === "boolean" ? (
                      <Select
                        value={value.toString()}
                        onValueChange={(val) => updateComponentProperty(key, val === "true")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">true</SelectItem>
                          <SelectItem value="false">false</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={value.toString()}
                        onChange={(e) => updateComponentProperty(key, e.target.value)}
                        className="text-sm"
                      />
                    )}
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Position</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-gray-500">X</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position.x}
                        onChange={(e) => {
                          const updatedComponents = canvasComponents.map(comp =>
                            comp.id === selectedComponent.id
                              ? { ...comp, position: { ...comp.position, x: parseInt(e.target.value) || 0 } }
                              : comp
                          );
                          setCanvasComponents(updatedComponents);
                          setSelectedComponent({
                            ...selectedComponent,
                            position: { ...selectedComponent.position, x: parseInt(e.target.value) || 0 }
                          });
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Y</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position.y}
                        onChange={(e) => {
                          const updatedComponents = canvasComponents.map(comp =>
                            comp.id === selectedComponent.id
                              ? { ...comp, position: { ...comp.position, y: parseInt(e.target.value) || 0 } }
                              : comp
                          );
                          setCanvasComponents(updatedComponents);
                          setSelectedComponent({
                            ...selectedComponent,
                            position: { ...selectedComponent.position, y: parseInt(e.target.value) || 0 }
                          });
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Size</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-gray-500">Width</Label>
                      <Input
                        type="number"
                        value={selectedComponent.size.width}
                        onChange={(e) => {
                          const updatedComponents = canvasComponents.map(comp =>
                            comp.id === selectedComponent.id
                              ? { ...comp, size: { ...comp.size, width: parseInt(e.target.value) || 0 } }
                              : comp
                          );
                          setCanvasComponents(updatedComponents);
                          setSelectedComponent({
                            ...selectedComponent,
                            size: { ...selectedComponent.size, width: parseInt(e.target.value) || 0 }
                          });
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Height</Label>
                      <Input
                        type="number"
                        value={selectedComponent.size.height}
                        onChange={(e) => {
                          const updatedComponents = canvasComponents.map(comp =>
                            comp.id === selectedComponent.id
                              ? { ...comp, size: { ...comp.size, height: parseInt(e.target.value) || 0 } }
                              : comp
                          );
                          setCanvasComponents(updatedComponents);
                          setSelectedComponent({
                            ...selectedComponent,
                            size: { ...selectedComponent.size, height: parseInt(e.target.value) || 0 }
                          });
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🎨</div>
                <p className="text-sm">Select a component on the canvas to edit its properties</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}