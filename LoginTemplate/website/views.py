from flask import Blueprint, jsonify, redirect, render_template, request, flash
from flask_login import login_required, current_user
from flask_login import login_user, login_required, logout_user, current_user
from .models import Note
from . import db
from . import socketio
# import json
views = Blueprint('views', __name__)



@views.route('/home', methods=['GET', 'POST'])
@login_required
def home():
    return render_template( 'home.html' )

@socketio.on( 'my event' )
def handle_my_custom_event(json):
    print("here")
    print( 'recived my event: ' + str( json ) )
    socketio.emit( 'my response', json, callback=messageRecived )
def messageRecived():
    print( 'message was received!!!' )
