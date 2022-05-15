from flask import Blueprint, jsonify, redirect, render_template, request, flash
from flask_login import login_required, current_user
from flask_login import login_user, login_required, logout_user, current_user
from .models import Note
from . import db
# import json
views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method=='POST':
        note=request.form.get('note')
                
        if len(note)<1:
            flash('Note is too short!', category='error')
        else:
            new_note=Note(data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Note added!', category='success')

    return render_template("home.html", user=current_user)

@views.route('/del/<int:id>')
def delete_note(id):
    delnote=Note.query.filter_by(id=id).first()
    db.session.delete(delnote)
    db.session.commit()
    return redirect('/')

    # note = json.loads(request.data)
    # print(note)
    # noteId = note['noteId']
    # note = Note.query.get(noteId)
    # if note:
    #     if note.user_id == current_user.id:
    #         db.session.delete(note)
    #         db.session.commit()
    
    # return jsonify({})