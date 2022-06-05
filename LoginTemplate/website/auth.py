from .models import User
from flask import Blueprint, render_template, request, flash, redirect, url_for
from sqlalchemy import true
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user

auth = Blueprint('auth', __name__)

# @auth.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         data=request.form
#         print(data)
#         email = request.form.get('email')
#         print(email)
#         password = request.form.get('password1')
#         print(password)
#         user = User.query.filter_by(email=email).first()
#         if user:
#             if check_password_hash(user.password, password):
#                 flash('Logged in Successfully', category= 'success')
#                 login_user(user, remember=True)
#                 return redirect(url_for('views.home'))
#             else:
#                 flash('Incorrect password, try again', category='error')
#         else:
#             flash('Email doesn\'t exist ', category='error')

#     return render_template("login.html",user=current_user)

# @auth.route('/logout')
# @login_required
# def logout():
#     logout_user()
#     return redirect(url_for('auth.login'))

# @auth.route('/sign-up', methods=['GET', 'POST'])
# def sign_up():
#     if request.method == 'POST':
#         print(request.form)
#         email = request.form.get('email')
#         print(email)
#         first_name = request.form.get('firstName')
#         print(first_name)
#         password1 = request.form.get('password1')
#         print(password1)
#         password2 = request.form.get('password2')
#         print(password2)
#         user = User.query.filter_by(email=email).first()
#         if user:
#             flash('Email already exists', category='error')
#         elif len(email)<4:
#             flash('Email length must be > 3 charcters.', category='error')
#         elif len(first_name)<2:
#             flash('Name should be more than one character.', category='error')
#         elif password1 != password2:
#             flash('Passwords don \'t match', category='error')
#         elif len(password1)<7:
#             flash('Password must be of atleast 7 characters.', category='error')
#         else:
#             new_user = User(email=email, first_name=first_name, password=generate_password_hash(password1, method='sha256'))
#             db.session.add(new_user)
#             db.session.commit()
#             flash('Account created successfully!', category='success')
#             login_user(new_user, remember=True)
#             return redirect(url_for('views.home'))

#     return render_template("sign_up.html",user= current_user)
email=''
@auth.route('/',methods=['GET', 'POST'])
def login():
    global email
    print(id(email))
    if request.method == 'POST':
        print(request.form)
        if request.form["submitbutton"]=="sign-in":
            data=request.form
            username = request.form.get('username')
            password = request.form.get('password1')
            user = User.query.filter_by(username=username).first()
            if user:
                if check_password_hash(user.password, password):
                    flash('', category= 'success')
                    login_user(user, remember=True)
                    return redirect(url_for('views.home',uname=username))
                else:
                    flash('Incorrect password, try again', category='error')
            else:
                flash('Email doesn\'t exist ', category='error')
            return render_template("login.html",user=current_user)

        elif request.form["submitbutton"]=="signup":
            print(request.form)
            username = request.form.get('username')
            email = request.form.get('email')
            year = request.form.get('year')
            first_name = request.form.get('firstName')
            password1 = request.form.get('password1')
            password2 = request.form.get('password2')
            user = User.query.filter_by(username=username).first()
            if user:
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
    logout_user()
    return redirect(url_for('auth.login'))