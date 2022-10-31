This is the repo containing the web interface for Colossus.

### Create an envrionment
```python
py -3 -m venv venv
```

### Activate the environment
```console
venv\Scripts\activate
```

### Install dependencies
```python
pip install -r requirements.txt
```

### Tailwind CLI build
```console
npx tailwindcss -i ./static/src/input.css -o ./static/dist/output.css --watch
```