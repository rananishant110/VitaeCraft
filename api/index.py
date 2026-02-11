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

# Import and create handler
from mangum import Mangum
from server import app

# Create Mangum handler for Vercel serverless
# This must be named 'handler' for Vercel to recognize it
handler = Mangum(app, lifespan="off")
