#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime
import uuid

class ProfolioAPITester:
    def __init__(self, base_url="https://smart-cv-creator-10.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.resume_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session_id = None

    def log_result(self, test_name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED")
        else:
            self.failed_tests.append({"test": test_name, "details": details})
            print(f"❌ {test_name} - FAILED: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        print(f"   Method: {method}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json() if response.content else {}
                    self.log_result(name, True)
                    return True, response_data
                except:
                    self.log_result(name, True)
                    return True, {}
            else:
                try:
                    error_data = response.json() if response.content else {}
                    self.log_result(name, False, f"Expected {expected_status}, got {response.status_code}. Response: {error_data}")
                except:
                    self.log_result(name, False, f"Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            self.log_result(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_user_registration(self):
        """Test user registration"""
        test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        test_data = {
            "email": test_email,
            "password": "testpass123",
            "full_name": "Test User"
        }
        
        success, response = self.run_test("User Registration", "POST", "auth/register", 200, test_data)
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"   ✓ Token obtained: {self.token[:20]}...")
            print(f"   ✓ User ID: {self.user_id}")
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        # First register a user for login test
        test_email = f"login_test_{uuid.uuid4().hex[:8]}@example.com"
        register_data = {
            "email": test_email,
            "password": "logintest123",
            "full_name": "Login Test User"
        }
        
        # Register user
        reg_success, reg_response = self.run_test("Pre-Login Registration", "POST", "auth/register", 200, register_data)
        
        if not reg_success:
            return False
            
        # Now test login
        login_data = {
            "email": test_email,
            "password": "logintest123"
        }
        
        success, response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        
        if success and 'access_token' in response:
            print(f"   ✓ Login successful")
            return True
        return False

    def test_get_user_profile(self):
        """Test getting current user profile"""
        if not self.token:
            self.log_result("Get User Profile", False, "No token available")
            return False
            
        return self.run_test("Get User Profile", "GET", "auth/me", 200)[0]

    def test_create_resume(self):
        """Test creating a new resume"""
        if not self.token:
            self.log_result("Create Resume", False, "No token available")
            return False
            
        resume_data = {
            "title": "Test Resume",
            "template": "professional",
            "data": {
                "personal_info": {
                    "full_name": "John Doe",
                    "email": "john@example.com",
                    "phone": "+1234567890",
                    "location": "New York, NY",
                    "summary": "Experienced professional"
                },
                "experiences": [
                    {
                        "id": str(uuid.uuid4()),
                        "company": "Tech Corp",
                        "position": "Software Engineer",
                        "start_date": "2020-01",
                        "end_date": "2023-12",
                        "current": False,
                        "description": "Developed software solutions",
                        "achievements": ["Built scalable systems", "Led team of 3 developers"]
                    }
                ],
                "education": [
                    {
                        "id": str(uuid.uuid4()),
                        "institution": "University",
                        "degree": "Bachelor's",
                        "field": "Computer Science",
                        "start_date": "2016",
                        "end_date": "2020"
                    }
                ],
                "skills": ["Python", "JavaScript", "React"],
                "projects": [],
                "certifications": []
            }
        }
        
        success, response = self.run_test("Create Resume", "POST", "resumes", 201, resume_data)
        
        if success and 'id' in response:
            self.resume_id = response['id']
            print(f"   ✓ Resume created with ID: {self.resume_id}")
            return True
        return False

    def test_get_resumes(self):
        """Test getting user's resumes"""
        if not self.token:
            self.log_result("Get Resumes", False, "No token available")
            return False
            
        return self.run_test("Get Resumes", "GET", "resumes", 200)[0]

    def test_get_single_resume(self):
        """Test getting a specific resume"""
        if not self.token or not self.resume_id:
            self.log_result("Get Single Resume", False, "No token or resume ID available")
            return False
            
        return self.run_test("Get Single Resume", "GET", f"resumes/{self.resume_id}", 200)[0]

    def test_update_resume(self):
        """Test updating a resume"""
        if not self.token or not self.resume_id:
            self.log_result("Update Resume", False, "No token or resume ID available")
            return False
            
        update_data = {
            "title": "Updated Test Resume",
            "template": "modern"
        }
        
        return self.run_test("Update Resume", "PUT", f"resumes/{self.resume_id}", 200, update_data)[0]

    def test_pdf_generation(self):
        """Test PDF generation"""
        if not self.token or not self.resume_id:
            self.log_result("PDF Generation", False, "No token or resume ID available")
            return False
            
        url = f"{self.base_url}/resumes/{self.resume_id}/pdf"
        headers = {'Authorization': f'Bearer {self.token}'}
        
        print(f"\n🔍 Testing PDF Generation...")
        print(f"   URL: {url}")
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code == 200 and response.headers.get('content-type') == 'application/pdf':
                self.log_result("PDF Generation", True)
                print(f"   ✓ PDF generated successfully ({len(response.content)} bytes)")
                return True
            else:
                self.log_result("PDF Generation", False, f"Status: {response.status_code}, Content-Type: {response.headers.get('content-type')}")
                return False
                
        except Exception as e:
            self.log_result("PDF Generation", False, f"Exception: {str(e)}")
            return False

    def test_payment_checkout(self):
        """Test payment checkout creation"""
        if not self.token:
            self.log_result("Payment Checkout", False, "No token available")
            return False
            
        payment_data = {
            "plan": "early_bird",
            "origin_url": "https://smart-cv-creator-10.preview.emergentagent.com"
        }
        
        success, response = self.run_test("Payment Checkout", "POST", "payments/create-checkout", 200, payment_data)
        
        if success and 'url' in response and 'session_id' in response:
            self.session_id = response['session_id']
            print(f"   ✓ Checkout URL created: {response['url'][:50]}...")
            print(f"   ✓ Session ID: {self.session_id}")
            return True
        return False

    def test_linkedin_import(self):
        """Test LinkedIn import (mocked)"""
        if not self.token:
            self.log_result("LinkedIn Import", False, "No token available")
            return False
            
        linkedin_data = {
            "linkedin_url": "https://linkedin.com/in/testuser"
        }
        
        success, response = self.run_test("LinkedIn Import", "POST", "linkedin/import", 200, linkedin_data)
        
        if success and response.get('is_mocked'):
            print(f"   ✓ Mocked LinkedIn data returned")
            return True
        return False

    def test_ai_features_without_premium(self):
        """Test AI features without premium (should fail)"""
        if not self.token or not self.resume_id:
            self.log_result("AI Features (No Premium)", False, "No token or resume ID available")
            return False
            
        # Test STAR enhancement
        star_data = {
            "experience_description": "I worked on projects",
            "role": "Software Engineer"
        }
        
        success, response = self.run_test("STAR Enhancement (No Premium)", "POST", "ai/star-enhance", 403, star_data)
        return success

    def test_delete_resume(self):
        """Test deleting a resume"""
        if not self.token or not self.resume_id:
            self.log_result("Delete Resume", False, "No token or resume ID available")
            return False
            
        return self.run_test("Delete Resume", "DELETE", f"resumes/{self.resume_id}", 200)[0]

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("🚀 PROFOLIO BACKEND API TESTING")
        print("=" * 60)
        
        # Basic API tests
        self.test_root_endpoint()
        
        # Authentication tests
        self.test_user_registration()
        self.test_user_login()
        self.test_get_user_profile()
        
        # Resume CRUD tests
        self.test_create_resume()
        self.test_get_resumes()
        self.test_get_single_resume()
        self.test_update_resume()
        
        # PDF generation test
        self.test_pdf_generation()
        
        # Payment tests
        self.test_payment_checkout()
        
        # LinkedIn import test
        self.test_linkedin_import()
        
        # AI features test (without premium)
        self.test_ai_features_without_premium()
        
        # Cleanup
        self.test_delete_resume()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"   • {failure['test']}: {failure['details']}")
        
        return len(self.failed_tests) == 0

def main():
    tester = ProfolioAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())