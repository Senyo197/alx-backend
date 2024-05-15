#!/usr/bin/env python3
"""A basic Flask app that uses Flask Babel for internationalization.
"""

from flask_babel import Babel
from flask import Flask, render_template, request


class Config:
    """Represents the configuration for the Flask Babel extension.
    """

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """Retrieves the best matching locale for the user's request.

    Returns:
        A string representing the best matching locale.
    """
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route('/')
def get_index() -> str:
    """Displays the home/index page.

    Returns:
        A string representing the HTML content of the home/index page.
    """
    return render_template('2-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
