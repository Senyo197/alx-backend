#!/usr/bin/env python3
"""Flask app with supporting internationalization using Flask Babel.
"""

from flask_babel import Babel
from flask import Flask, render_template, request


class Config:
    """Represents the configuration for the Flask Babel extension.

    Attributes:
        LANGUAGES (list of str): A list of supported languages.
        BABEL_DEFAULT_LOCALE (str): The default language to use.
        BABEL_DEFAULT_TIMEZONE (str): The default timezone to use.
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
        str: A string representing the best matching locale.
    """
    queries = request.query_string.decode('utf-8').split('&')
    query_table = dict(map(
        lambda x: (x if '=' in x else '{}='.format(x)).split('='),
        queries,
    ))
    if 'locale' in query_table:
        if query_table['locale'] in app.config["LANGUAGES"]:
            return query_table['locale']
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route('/')
def get_index() -> str:
    """Displays the home/index page.

    Returns:
        str: A string representing the HTML content of the home/index page.
    """
    return render_template('4-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
