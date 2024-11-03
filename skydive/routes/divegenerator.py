from flask import Blueprint, request, flash, render_template
import random

bp = Blueprint('divegen', __name__)


@bp.route("/divegenerator/", methods=["POST", "GET"])
def dive_generator():
    randoms = [(1, r) for r in
               ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M",
                "N", "O", "P", "Q"]]
    a_blocks = [(2, b) for b in ["2", "4", "6", "7", "8", "9", "19", "21"]]
    aa_blocks = [(2, b) for b in
                 ["1", "11", "13", "14", "15", "18", "20", "22"]]
    aaa_blocks = [(2, b) for b in ["3", "5", "10", "12", "16", "17"]]

    full_program = []

    if request.args.get("num_jumps") and request.args.get("class"):
        match request.args["class"].lower():
            case "rookie":
                min_points_per_jump = 3
                pool = randoms
            case "a":
                min_points_per_jump = 3
                pool = randoms + a_blocks
            case "aa":
                min_points_per_jump = 4
                pool = randoms + a_blocks + aa_blocks
            case "aaa":
                min_points_per_jump = 5
                pool = randoms + a_blocks + aa_blocks + aaa_blocks
            case "custom":
                min_points_per_jump = int(request.args["num_points"])
                form_elements = request.args
                prefixes = ("random-", "a_block-",
                            "aa_block-", "aaa_block-")
                pool = [
                    (1, f.split("-")[1].upper())
                    if f.split("-")[1].isalpha() else (2, f.split("-")[1])
                    for f, state in form_elements.items()
                    if state and f.startswith(prefixes)]

        current_pool = pool.copy()

        if sum([point for point, formation in pool]) >= \
                min_points_per_jump:
            for i in range(int(request.args["num_jumps"])):
                program = []

                while sum([p[0] for p in program]) < min_points_per_jump:
                    selected = random.choice(
                        [item for item in current_pool
                            if item not in program])
                    program.append(selected)
                    current_pool.remove(selected)

                    if len(current_pool) <= 0:
                        current_pool = pool.copy()
                full_program.append(program)
        else:
            flash("Not enough formations to be able to make a program!",
                  "error")

    return render_template(
        "divegenerator.html", program=full_program, randoms=randoms,
        a_blocks=a_blocks, aa_blocks=aa_blocks, aaa_blocks=aaa_blocks)
