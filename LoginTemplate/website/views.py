from flask import Blueprint, jsonify, redirect, render_template, request, flash
from flask_login import login_required, current_user
from flask_login import login_user, login_required, logout_user, current_user
from .models import Note
from . import db
from . import socketio

# import json
views = Blueprint('views', __name__)


@views.route('/<email>', methods=['GET', 'POST'])
@login_required
def home(email):
    if email == '':
        email='undefined'
    print("chutiya")
    return render_template( 'home.html' , mail = email )

