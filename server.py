# static server with tokens generated on endpoint "/token" 
# install:  > pip3 install urllib3==1.26.6
# run:      > python3 server.py

import http.server
import socketserver
import requests
from urllib.parse import urlparse, parse_qs

# Replace with your Autodesk APS/Forge client_id and client_secret
APS_CLIENT_ID = "cw3yYG0wCvDOcPxxfH91UC1KHWuajJyR"
APS_SECRET = "BsPxv0qdJUvUhBM8"
TANDEM_SCOPE = "data:read"
PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL path
        url = urlparse(self.path)
        path = url.path
        if path == "/token":
            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()
            self.wfile.write(bytes(self.get_two_legged_token(), "utf8"))
            return
        else:
            # Serve static files
            super().do_GET()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()


    def get_two_legged_token(self):
        url = "https://developer.api.autodesk.com/authentication/v1/authenticate"
        headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
        data = {
            'client_id': APS_CLIENT_ID,
            'client_secret': APS_SECRET,
            'scope': TANDEM_SCOPE,
            'grant_type': 'client_credentials'
        }
        response = requests.post(url, headers=headers, data=data)
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            return None

with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()