from os import environ

SECRET_KEY = environ.get("SECRET_KEY", "development")
SQLALCHEMY_DATABASE_URI = environ.get("DB_URL")
SQLALCHEMY_TRACK_MODIFICATIONS = False
VIDEO_FOLDER = environ.get("VIDEO_FOLDER", "/videos")
OAUTH2_PROVIDERS = {
    # Google OAuth 2.0 documentation:
    # https://developers.google.com/identity/protocols/oauth2/web-server#httprest
    'google': {
        'client_id': environ.get('GOOGLE_CLIENT_ID'),
        'client_secret': environ.get('GOOGLE_CLIENT_SECRET'),
        'authorize_url': 'https://accounts.google.com/o/oauth2/auth',
        'token_url': 'https://accounts.google.com/o/oauth2/token',
        'userinfo': {
            'url': 'https://www.googleapis.com/oauth2/v3/userinfo',
            'email': lambda json: json['email'],
        },
        'scopes': ['https://www.googleapis.com/auth/userinfo.email'],
    }
}
