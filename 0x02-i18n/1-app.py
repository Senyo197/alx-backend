#!/usr/bin/env python3

"""
A Flask application that uses Flask-Babel for i18n.
"""

from flask import Flask, render_template
from flask_babel import Babel


class Config:
    """
    Represents a Flask-Babel configuration.

    Attributes:
        LANGUAGES (list of str): The available languages for the application.
        BABEL_DEFAULT_LOCALE (str): The default locale for the application.
        BABEL_DEFAULT_TIMEZONE (str): The default timezone for the application.
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@app.route('/')
def index() -> str:
    """
    Renders the home/index page.

    Returns:
        str: The rendered HTML content of the page.
    """
    return render_template('1-index.html')


if __name__ == '__main__':
    """
    Starts the application server.

    The application will be accessible at http://localhost:5000/.
    """
    app.run(host='0.0.0.0', port=5000)
