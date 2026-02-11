"""
Vercel Serverless Function Handler for FastAPI Backend
This file routes all API requests to the FastAPI application
"""

import sys
from pathlib import Path
import os

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Set environment for production
os.environ.setdefault('ENV', 'production')

try:
    from mangum import Mangum
    from backend.server import app
    
    # Create Mangum handler for Vercel serverless
    handler = Mangum(app, lifespan="off")
    
except ImportError as e:
    print(f"Error importing dependencies: {e}")
    print("Make sure mangum is installed: pip install mangum")
    raise
except Exception as e:
    print(f"Error initializing app: {e}")
    raise
