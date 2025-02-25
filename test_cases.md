# COMPY - Test Cases

## Overview
This document contains test cases for the COMPY personal data assistant application. Each test case follows a structured format to ensure comprehensive testing of all features.

## Test Case Structure

| Field | Description |
|-------|-------------|
| Test Case ID | Unique identifier for the test case |
| Title | Brief descriptive title of the test |
| Description | Detailed description of the feature being tested |
| Preconditions | Requirements that must be met before executing the test |
| Test Steps | Step-by-step instructions to execute the test |
| Expected Results | Expected outcome for each test step |
| Priority | Importance of the test (High/Medium/Low) |
| Status | Current execution status (Not Started/In Progress/Passed/Failed) |
| Assigned To | Person responsible for executing the test |
| Test Date | Date when the test was executed |

## Test Cases

### Core Functionality

#### TC-001: Search Functionality
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-001 |
| **Title** | Verify Real-time Search Functionality |
| **Description** | Test that the search feature filters entries in real-time as the user types |
| **Preconditions** | 1. COMPY application is running<br>2. Data file (comm.csv) contains at least 10 entries |
| **Test Steps** | 1. Navigate to the main COMPY interface<br>2. Click on the search bar<br>3. Type a keyword that matches at least one entry<br>4. Type a keyword that doesn't match any entry |
| **Expected Results** | 1. Main interface loads successfully<br>2. Search bar is focused and ready for input<br>3. Entries are filtered in real-time to show only matching results<br>4. No entries are displayed and "No results found" message appears |
| **Priority** | High |
| **Status** | Not Started |
| **Assigned To** | |
| **Test Date** | |

#### TC-002: Copy to Clipboard
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-002 |
| **Title** | Verify Copy to Clipboard Functionality |
| **Description** | Test that clicking on an entry copies its content to the clipboard |
| **Preconditions** | 1. COMPY application is running<br>2. Data file contains at least one entry |
| **Test Steps** | 1. Navigate to the main COMPY interface<br>2. Click on any visible entry<br>3. Paste the clipboard content into a text editor |
| **Expected Results** | 1. Main interface loads successfully<br>2. Visual feedback indicates the entry was copied<br>3. Pasted content matches the selected entry's command/text |
| **Priority** | High |
| **Status** | Not Started |
| **Assigned To** | |
| **Test Date** | |

### Security Features

#### TC-003: Sensitive Data Masking
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-003 |
| **Title** | Verify Sensitive Data Masking |
| **Description** | Test that sensitive data marked with ## is properly masked in the interface |
| **Preconditions** | 1. COMPY application is running<br>2. Data file contains at least one entry with ## markers |
| **Test Steps** | 1. Navigate to the main COMPY interface<br>2. Locate an entry containing sensitive data (marked with ##)<br>3. Verify the display of the sensitive data<br>4. Click on the entry to copy it |
| **Expected Results** | 1. Main interface loads successfully<br>2. Entry with sensitive data is found<br>3. Sensitive data is displayed as masked (e.g., ******)<br>4. The actual unmasked data is copied to clipboard |
| **Priority** | High |
| **Status** | Not Started |
| **Assigned To** | |
| **Test Date** | |

### User Interface

#### TC-004: Theme Switching
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-004 |
| **Title** | Verify Theme Switching Functionality |
| **Description** | Test that users can switch between different themes and the selection persists |
| **Preconditions** | 1. COMPY application is running |
| **Test Steps** | 1. Navigate to the main COMPY interface<br>2. Click on the theme icon<br>3. Select a different theme<br>4. Refresh the page<br>5. Close and reopen the application |
| **Expected Results** | 1. Main interface loads successfully<br>2. Theme selection menu appears<br>3. Interface updates to display the selected theme<br>4. Selected theme persists after refresh<br>5. Selected theme persists after application restart |
| **Priority** | Medium |
| **Status** | Not Started |
| **Assigned To** | |
| **Test Date** | |

#### TC-005: Mobile Responsiveness
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-005 |
| **Title** | Verify Mobile Responsiveness |
| **Description** | Test that the interface adapts properly to mobile screen sizes |
| **Preconditions** | 1. COMPY application is running<br>2. Mobile device or browser developer tools with mobile emulation |
| **Test Steps** | 1. Open COMPY on a mobile device or using mobile emulation<br>2. Test the search functionality<br>3. Test copying entries<br>4. Test theme switching |
| **Expected Results** | 1. Interface scales appropriately to the screen size<br>2. Search works correctly on mobile<br>3. Copy functionality works on mobile<br>4. Theme switching works on mobile |
| **Priority** | Medium |
| **Status** | Not Started |
| **Assigned To** | |
| **Test Date** | |

### Data Management

#### TC-006: Data Loading
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-006 |
| **Title** | Verify Data Loading from CSV |
| **Description** | Test that the application correctly loads data from the CSV file |
| **Preconditions** | 1. COMPY application is not running<br>2. Data file (comm.csv) exists with valid entries |
| **Test Steps** | 1. Open the data file and note the number of entries<br>2. Launch the COMPY application<br>3. Count the number of entries displayed |
| **Expected Results** | 1. Data file opens successfully<br>2. Application launches without errors<br>3. Number of displayed entries matches the number in the data file |
| **Priority** | High |
| **Status** | Not Started |
| **Assigned To** | |
| **Test Date** | |

#### TC-007: Custom File Path
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-007 |
| **Title** | Verify Custom Data File Path |
| **Description** | Test that the application can load data from a custom file path specified in user_config.json |
| **Preconditions** | 1. COMPY application is not running<br>2. A test CSV file exists in a different location |
| **Test Steps** | 1. Edit user_config.json to point to the test CSV file<br>2. Launch the COMPY application<br>3. Verify the data displayed matches the test file |
| **Expected Results** | 1. user_config.json is updated successfully<br>2. Application launches without errors<br>3. Data from the test file is displayed correctly |
| **Priority** | Medium |
| **Status** | Not Started |
| **Assigned To** | |
| **Test Date** | |

### Configuration

#### TC-008: User Configuration
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-008 |
| **Title** | Verify User Configuration Settings |
| **Description** | Test that user settings in user_config.json are applied correctly |
| **Preconditions** | 1. COMPY application is not running |
| **Test Steps** | 1. Edit user_config.json to change the user_name and theme<br>2. Launch the COMPY application<br>3. Verify the username is displayed correctly<br>4. Verify the theme is applied correctly |
| **Expected Results** | 1. user_config.json is updated successfully<br>2. Application launches without errors<br>3. Username is displayed as configured<br>4. Theme matches the configuration |
| **Priority** | Medium |
| **Status** | Not Started |
| **Assigned To** | |
| **Test Date** | |

#### TC-009: Server Port Configuration
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-009 |
| **Title** | Verify Custom Server Port |
| **Description** | Test that the application can run on a custom port specified in CompyRunner.bat |
| **Preconditions** | 1. COMPY application is not running |
| **Test Steps** | 1. Edit CompyRunner.bat to use a different port (e.g., 8080)<br>2. Launch the COMPY application<br>3. Verify the application is accessible on the new port |
| **Expected Results** | 1. CompyRunner.bat is updated successfully<br>2. Application launches without errors<br>3. Application is accessible at http://localhost:8080 |
| **Priority** | Low |
| **Status** | Not Started |
| **Assigned To** | |
| **Test Date** | |

### Error Handling

#### TC-010: Missing Data File
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-010 |
| **Title** | Verify Error Handling for Missing Data File |
| **Description** | Test that the application handles missing data file gracefully |
| **Preconditions** | 1. COMPY application is not running<br>2. Temporarily rename or move the data file |
| **Test Steps** | 1. Launch the COMPY application<br>2. Observe the error message<br>3. Restore the data file<br>4. Refresh the application |
| **Expected Results** | 1. Application launches with an appropriate error message<br>2. Error message is clear and helpful<br>3. Data file is restored<br>4. Application loads data correctly after refresh |
| **Priority** | Medium |
| **Status** | Not Started |
| **Assigned To** | |
| **Test Date** | | 