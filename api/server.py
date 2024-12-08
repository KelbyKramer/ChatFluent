from flask import Flask, jsonify, redirect, session, url_for
from dotenv import load_dotenv
import os
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from urllib.parse import urlencode, quote_plus

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure Flask app
    app.secret_key = os.getenv("APP_SECRET_KEY")
    CORS(app)

    # OAuth setup
    oauth = OAuth(app)
    oauth.register(
        "auth0",
        client_id=os.getenv("AUTH0_CLIENT_ID"),
        client_secret=os.getenv("AUTH0_CLIENT_SECRET"),
        client_kwargs={
            "scope": "openid profile email",
        },
        server_metadata_url=f'https://{os.getenv("AUTH0_DOMAIN")}/.well-known/openid-configuration'
    )

    @app.route("/api/auth/login")
    def login():
        return oauth.auth0.authorize_redirect(
            redirect_uri=url_for("callback", _external=True)
        )

    @app.route("/api/auth/callback")
    def callback():
        token = oauth.auth0.authorize_access_token()
        session["user"] = token
        return redirect("/")

    @app.route("/api/auth/logout")
    def logout():
        session.clear()
        return redirect(
            "https://" + os.getenv("AUTH0_DOMAIN")
            + "/v2/logout?"
            + urlencode(
                {
                    "returnTo": url_for("home", _external=True),
                    "client_id": os.getenv("AUTH0_CLIENT_ID"),
                },
                quote_via=quote_plus,
            )
        )

    @app.route("/api/auth/user")
    def get_user():
        return jsonify(session.get('user', {}))

    @app.route("/")
    def home():
        return jsonify({"message": "API is running"})

    return app, oauth

app, oauth = create_app()

if __name__ == "__main__":
    app.run(debug=True)