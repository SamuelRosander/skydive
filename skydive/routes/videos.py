from flask import Blueprint, render_template, abort, send_from_directory, \
    current_app
import os

bp = Blueprint('videos', __name__, url_prefix="/videos")


@bp.route('/')
@bp.route('/<path:subfolder>')
def browse(subfolder=None):
    base_path = current_app.config.get("VIDEO_FOLDER")

    folder_path = os.path.join(
        base_path, subfolder) if subfolder else base_path

    if not os.path.exists(folder_path) or not os.path.commonpath(
            [base_path]) == os.path.commonpath(
            [base_path, folder_path]):
        abort(404, "Folder does not exist or invalid path")

    dirs = [{"name": d, "full_path": os.path.relpath(
        os.path.join(folder_path, d),
        base_path)} for d in os.listdir(folder_path)
        if os.path.isdir(os.path.join(folder_path, d))]

    files = [{"name": f, "full_path": os.path.relpath(
        os.path.join(folder_path, f),
        base_path)} for f in os.listdir(folder_path)
        if os.path.isfile(os.path.join(folder_path, f))]

    dirs = sorted(dirs, key=lambda x: x["name"])
    files = sorted(files, key=lambda x: x["name"])

    return render_template(
        "videos.html", dirs=dirs, files=files, subfolder=subfolder)


@bp.route('/download/<path:filename>')
def download(filename):
    return send_from_directory(
        current_app.config.get("VIDEO_FOLDER"),
        filename)


@bp.route('/play/<path:filename>')
def play(filename):
    return render_template("play.html", file=filename)
