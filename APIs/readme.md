# Instructions
1. Create virtual environment (Optional but recommended) and activate it.
2. Install requirements
```bash
pip install -r requirements.txt
```
3. Install detectron (must be installed separately, otherwise causes errors):
```bash
pip install --no-build-isolation detectron2 @ git+https://github.com/facebookresearch/detectron2.git@9604f5995cc628619f0e4fd913453b4d7d61db3f
```
4. Run server
```bash
python main.py
```
5. Access api docs at link: http://127.0.0.1:8001/docs

## Frontend CORS

The API allows the local Vite origins `http://localhost:5173` and `http://127.0.0.1:5173` by default. Set `FRONTEND_ORIGINS` to a comma-separated list of trusted origins when deploying the frontend elsewhere.
