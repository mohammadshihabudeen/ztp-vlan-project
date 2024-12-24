from flask import Flask
from app.routes import blueprint

app = Flask(__name__)
app.register_blueprint(blueprint)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
