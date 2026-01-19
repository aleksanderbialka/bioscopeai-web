# BioScopeAI Web - UML Activity Diagrams

This directory contains UML activity diagrams illustrating the main user workflows and activities in the BioScopeAI Web application.

## 📊 Available Diagrams

### 1. [User Authentication](./user-authentication.md)
Comprehensive authentication flows including:
- **Login Flow** - User authentication with JWT tokens and automatic refresh
- **Registration Flow** - New user account creation

**Key Activities:**
- Email/password authentication
- Token management (access & refresh tokens)
- Automatic token refresh on expiration
- Session management
- User logout

---

### 2. [Dataset Management](./dataset-management.md)
Dataset creation and management workflows:
- **Create Dataset** - Creating new biological datasets
- **View and Manage Dataset** - Viewing, editing, and managing existing datasets

**Key Activities:**
- Create new datasets with name and description
- View dataset details and image collections
- Upload images to datasets
- Edit dataset information
- Delete datasets with confirmation
- Manage images within datasets

---

### 3. [Image Classification](./image-classification.md)
AI-powered image classification processes:
- **Run AI Classification** - Execute classification jobs on biological images
- **View Classification History** - Browse and manage classification results

**Key Activities:**
- Select images for classification
- Configure classification parameters (model, confidence threshold)
- Monitor classification job progress
- View results with confidence scores and detections
- Export classification results (CSV/JSON)
- Filter and search classification history
- Delete classification records

---

### 4. [Device and Streaming](./device-streaming.md)
Device management and live streaming functionality:
- **Device Management** - Add, configure, and manage connected microscope devices
- **Live Streaming** - Real-time video streaming from devices using WebRTC

**Key Activities:**
- Add new devices with connection configuration
- View device status (online/offline)
- Edit and delete devices
- Initialize WebRTC connections
- View live video streams
- Capture frames from stream
- Save captured frames to datasets
- Adjust stream settings (resolution, quality)
- Handle connection loss and reconnection

---

### 5. [Admin Operations](./admin-operations.md)
Administrative functions for system management:
- **User Management** - Admin panel for managing users and roles
- **System Monitoring** - System health and activity monitoring

**Key Activities:**
- View all users in the system
- Create new user accounts
- Edit user information and roles
- Change user permissions (Admin, User, Read-only)
- Deactivate or delete user accounts
- Search and filter users
- View system statistics and metrics
- Monitor resource usage
- Generate activity reports
- Export system data

---

## 📖 How to Read These Diagrams

The activity diagrams follow UML notation and use Mermaid syntax for rendering:

### Symbols Used:
- **Rounded rectangles** `([Start])` - Start/End points
- **Rectangles** `[Action]` - Process or action steps
- **Diamonds** `{Decision?}` - Decision points with Yes/No branches
- **Arrows** `-->` - Flow direction

### Common Patterns:
- **Validation Flows**: User input → Validation → Success/Error feedback loop
- **API Interactions**: Frontend action → API request → Success/Error handling
- **Modal Workflows**: Open modal → User input → Validate → Submit → Close modal
- **CRUD Operations**: Create, Read, Update, Delete patterns with confirmations

---

## 🎯 Business Value

These diagrams serve multiple purposes:

1. **Developer Onboarding** - Help new developers understand application flows
2. **Product Documentation** - Document user journeys and system behavior
3. **Testing Reference** - Guide test case development and QA workflows
4. **Stakeholder Communication** - Visualize features for non-technical stakeholders
5. **Architecture Planning** - Support system design and improvement discussions

---

## 🔄 Maintaining These Diagrams

When adding new features or modifying existing workflows:

1. Update the relevant diagram file
2. Ensure Mermaid syntax is valid
3. Test rendering in GitHub or Mermaid Live Editor
4. Keep descriptions clear and concise
5. Update this index if adding new diagram files

---

## 🛠️ Tools for Viewing

These diagrams use [Mermaid](https://mermaid.js.org/) syntax and can be viewed in:

- **GitHub** - Native Mermaid rendering in markdown files
- **Mermaid Live Editor** - https://mermaid.live/
- **VS Code** - With Mermaid extensions
- **Documentation Sites** - Most support Mermaid rendering

---

## 📋 Future Diagrams

Potential additions for comprehensive documentation:

- Image upload and processing workflow
- Batch operations on datasets/images
- Data export and backup procedures
- API integration workflows
- Mobile/responsive UI interactions
- Error handling and recovery procedures

---

**Last Updated**: 2026-01-19  
**Maintained By**: Development Team
