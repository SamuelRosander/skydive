from flask import Blueprint, render_template

bp = Blueprint('logbook', __name__, url_prefix="/logbook")


@bp.route('/')
def logbook():
    return render_template("logbook.html")


@bp.route("/import/")
def logbook_import():
    return render_template("logbook_import.html")


@bp.route("/export/")
def logbook_export():
    return render_template("logbook_export.html")
