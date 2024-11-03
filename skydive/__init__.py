from flask import Flask
from .extensions import db, login_manager
from .routes import main, auth, divegenerator, logbook


def create_app(test_config=None):
    app = Flask(__name__)

    if test_config:
        app.config.from_mapping(test_config)
    else:
        app.config.from_pyfile("config.py")

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "home"

    app.register_blueprint(main.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(divegenerator.bp)
    app.register_blueprint(logbook.bp)

    app.register_error_handler(401, main.error)
    app.register_error_handler(403, main.error)
    app.register_error_handler(404, main.error)
    app.register_error_handler(500, main.error)

    app.jinja_env.trim_blocks = True
    app.jinja_env.lstrip_blocks = True

    return app
