from .models import User
from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from sqlalchemy import true
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user
import requests
import json
auth = Blueprint('auth', __name__)
def email_validation(email):
    try:
        initial=(email[:3]).lower()
        if initial=='lci' or initial=='lcs' or initial=='lcb' or initial=='lit':
            year=int(email[3:7])
            rollno =int(email[7:10])
            if 2016<=year and year<2019:
                if initial=='lci' or initial=='lcb':
                    return False
                elif rollno>120 or rollno<0:
                    return False
            elif 2019<=year and year<=2020:
                if initial=='lcb':
                    return False
                elif rollno<0 and rollno > 80:
                    return False
            elif year==2021:
                if rollno<0 or rollno>60:
                    return False
        else:
            return False
    except Exception:
        return False
    return True
email=''
@auth.route('/',methods=['GET', 'POST'])
def login():
    global email
    if request.method == 'POST':
        if request.form["submitbutton"]=="sign-in":
            data=request.form
            username = request.form.get('username')
            password = request.form.get('password1')
            user = User.query.filter_by(username=username).first()
            if user:
                if check_password_hash(user.password, password):
                    flash('', category= 'success')
                    login_user(user, remember=False)
                    return redirect(url_for('views.home',uname=username))
                else:
                    flash('Incorrect password, try again', category='error')
            else:
                flash('Email doesn\'t exist ', category='error')
            return render_template("login.html",user=current_user)

        elif request.form["submitbutton"]=="signup":
            username = request.form.get('username')
            email = request.form.get('email')
            year = request.form.get('year')
            first_name = request.form.get('firstName')
            password1 = request.form.get('password1')
            password2 = request.form.get('password2')
            data = {
                'text': username,
                'mode': 'username',
                'lang': 'en',
                'api_user': '45211228',
                'api_secret': 'UwQPeDmdHyZBgpaKLUqF'
                }
            r = requests.post('https://api.sightengine.com/1.0/text/check.json', data=data)
            output = json.loads(r.text)
            profanity_match=len(output['profanity']['matches'])
            misleading_match=len(output['misleading']['matches'])
            print(output)
            user = User.query.filter_by(username=username).first()
            if not email_validation(email):
                flash('Invalid email', category='error')
            elif (profanity_match>0) or (misleading_match>0):
                flash("Sorry you can't have that username")
            elif user:
                flash('Email already exists', category='error')
            elif len(email)<4:
                flash('Email length must be > 3 charcters.', category='error')
            elif len(first_name)<2:
                flash('Name should be more than one character.', category='error')
            elif password1 != password2:
                flash('Passwords don \'t match', category='error')
            elif len(password1)<7:
                flash('Password must be of atleast 7 characters.', category='error')
            else:
                new_user = User(email=email,username=username,year=year, first_name=first_name, password=generate_password_hash(password1, method='sha256'))
                db.session.add(new_user)
                db.session.commit()
                flash('', category='success')
                login_user(new_user, remember=True)
                return redirect(url_for('views.home',uname=username))
            return render_template("login.html",user= current_user)
        else:
            return render_template("login.html",user= current_user)
    elif request.method == 'GET':
        return render_template("login.html",user= current_user)

@auth.route('/logout')
@login_required
def logout():
    session.clear()
    logout_user()
    return redirect(url_for('auth.login'))