import { NextRequest, NextResponse } from "next/server";

interface CanvasComponent {
  id: string;
  component: {
    type: string;
    name: string;
    properties: { [key: string]: any };
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: { [key: string]: any };
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  components: CanvasComponent[];
  settings: {
    theme: string;
    targetSdk: string;
    minSdk: string;
    packageName?: string;
    versionCode?: string;
    versionName?: string;
  };
}

// Generate Android XML layout from components
function generateLayoutXML(components: CanvasComponent[]): string {
  const xmlHeader = `<?xml version="1.0" encoding="utf-8"?>`;
  
  if (components.length === 0) {
    return `${xmlHeader}
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <!-- Add your components here -->
    
</LinearLayout>`;
  }

  let layoutContent = `${xmlHeader}
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">

`;

  components.forEach((comp, index) => {
    const androidType = comp.component.type;
    const componentId = `${androidType.toLowerCase()}_${index + 1}`;
    
    layoutContent += `    <${androidType}
        android:id="@+id/${componentId}"
        android:layout_width="${comp.size.width}dp"
        android:layout_height="${comp.size.height}dp"`;
    
    // Add position using margins
    if (comp.position.x > 0) {
      layoutContent += `\n        android:layout_marginStart="${comp.position.x}dp"`;
    }
    if (comp.position.y > 0) {
      layoutContent += `\n        android:layout_marginTop="${comp.position.y}dp"`;
    }

    // Add component-specific properties
    Object.entries(comp.properties).forEach(([key, value]) => {
      const androidAttr = mapPropertyToAndroid(key, value);
      if (androidAttr) {
        layoutContent += `\n        ${androidAttr}`;
      }
    });

    layoutContent += ` />\n\n`;
  });

  layoutContent += `</RelativeLayout>`;
  return layoutContent;
}

// Map component properties to Android XML attributes
function mapPropertyToAndroid(key: string, value: any): string | null {
  switch (key) {
    case "text":
      return `android:text="${value}"`;
    case "hint":
      return `android:hint="${value}"`;
    case "textSize":
      return `android:textSize="${value}"`;
    case "textColor":
      return `android:textColor="${value}"`;
    case "backgroundColor":
      return `android:background="${value}"`;
    case "gravity":
      return `android:gravity="${value}"`;
    case "inputType":
      return `android:inputType="${value}"`;
    case "maxLines":
      return `android:maxLines="${value}"`;
    case "scaleType":
      return `android:scaleType="${value}"`;
    case "checked":
      return `android:checked="${value}"`;
    case "orientation":
      return `android:orientation="${value}"`;
    default:
      return null;
  }
}

// Generate MainActivity.java
function generateMainActivity(projectData: ProjectData): string {
  const packageName = projectData.settings.packageName || "com.androidbuilder.app";
  
  return `package ${packageName};

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Handle window insets for edge-to-edge display
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        
        // Initialize your UI components here
        initializeComponents();
    }
    
    private void initializeComponents() {
        // TODO: Add component initialization and event handling
        
        ${projectData.components.map((comp, index) => {
          const androidType = comp.component.type;
          const componentId = `${androidType.toLowerCase()}_${index + 1}`;
          return `// ${androidType} component
        ${androidType} ${componentId} = findViewById(R.id.${componentId});`;
        }).join('\n        ')}
    }
}`;
}

// Generate AndroidManifest.xml
function generateAndroidManifest(projectData: ProjectData): string {
  const packageName = projectData.settings.packageName || "com.androidbuilder.app";
  const versionCode = projectData.settings.versionCode || "1";
  const versionName = projectData.settings.versionName || "1.0.0";
  
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="${packageName}"
    android:versionCode="${versionCode}"
    android:versionName="${versionName}">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.${projectData.name.replace(/\s+/g, '')}"
        tools:targetApi="31">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.${projectData.name.replace(/\s+/g, '')}.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`;
}

// Generate build.gradle (Module: app)
function generateBuildGradle(projectData: ProjectData): string {
  const packageName = projectData.settings.packageName || "com.androidbuilder.app";
  const targetSdk = projectData.settings.targetSdk || "34";
  const minSdk = projectData.settings.minSdk || "21";
  const versionCode = projectData.settings.versionCode || "1";
  const versionName = projectData.settings.versionName || "1.0.0";

  return `plugins {
    id 'com.android.application'
}

android {
    namespace '${packageName}'
    compileSdk ${targetSdk}

    defaultConfig {
        applicationId "${packageName}"
        minSdk ${minSdk}
        targetSdk ${targetSdk}
        versionCode ${versionCode}
        versionName "${versionName}"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    
    buildFeatures {
        viewBinding true
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.activity:activity:1.8.2'
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}`;
}

// Generate strings.xml
function generateStringsXml(projectData: ProjectData): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${projectData.name}</string>
    <string name="app_description">${projectData.description}</string>
    
    <!-- Add your string resources here -->
    ${projectData.components.map((comp, index) => {
      if (comp.properties.text) {
        return `<string name="${comp.component.type.toLowerCase()}_${index + 1}_text">${comp.properties.text}</string>`;
      }
      if (comp.properties.hint) {
        return `<string name="${comp.component.type.toLowerCase()}_${index + 1}_hint">${comp.properties.hint}</string>`;
      }
      return "";
    }).filter(Boolean).join('\n    ')}
</resources>`;
}

export async function POST(request: NextRequest) {
  try {
    const projectData: ProjectData = await request.json();

    if (!projectData.id || !projectData.name) {
      return NextResponse.json(
        { error: "Project ID and name are required" },
        { status: 400 }
      );
    }

    // Generate all Android project files
    const files = {
      "app/src/main/res/layout/activity_main.xml": generateLayoutXML(projectData.components),
      "app/src/main/java/MainActivity.java": generateMainActivity(projectData),
      "app/src/main/AndroidManifest.xml": generateAndroidManifest(projectData),
      "app/build.gradle": generateBuildGradle(projectData),
      "app/src/main/res/values/strings.xml": generateStringsXml(projectData),
      "README.md": `# ${projectData.name}

${projectData.description}

## Project Details
- Package: ${projectData.settings.packageName || "com.androidbuilder.app"}
- Target SDK: ${projectData.settings.targetSdk || "34"}
- Min SDK: ${projectData.settings.minSdk || "21"}
- Components: ${projectData.components.length}

## Generated by AndroidBuilder AI
This project was created using AndroidBuilder AI - an AI-powered drag-and-drop Android app builder.

## Setup Instructions
1. Open this project in Android Studio
2. Sync project with Gradle files
3. Run the app on an emulator or device

## Components Used
${projectData.components.map((comp) => 
  `- ${comp.component.type} (${comp.component.name})`
).join('\n')}
`
    };

    return NextResponse.json({
      success: true,
      files,
      projectName: projectData.name,
      packageName: projectData.settings.packageName || "com.androidbuilder.app",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json(
      { error: "Failed to export project" },
      { status: 500 }
    );
  }
}