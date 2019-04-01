# smallmis
A small medical information system, developing for training purpose only.

[Example deployed on heroku](https://smallmis.herokuapp.com/)

This is a port of a small single-user medical records management system written by myself in 2010 using Apache, php, MySQL and some JavaScript for AJAX.

## What this system can do
At present, it can:
* create new patient
* search patients among created
* view and edit patient information
* delete patient

## Technology stack
Smallmis is powered by:
* backend
  * JavaScript/Node.JS
  * Hapi
  * Joi
  * MongoDB/Mongoose
* frontend
  * React
  
## What is planned to do
* interface for work with medical records
  * manage types of medical records
  * create, update and delete records
  * extract and show specific medical information from records, i.e. BMI from records of body weight and height or cardiovascular risk from records about cholesterol and BP levels, smoking status, age and sex
* authorization (just for learning how to do authorization in web applications)
* logging and monitoring
* user-friendly error messages
* i18n

## Manual
### Create new patient
1. In search line type (in given order): 
* family name, 
* first name, 
* patronymic name (father's name), 
* sex (one char - 'f' or cyrillic 'ж' for female, 'm' or 'м' for male) and 
* date of birth (in format dd.mm.yyyy, year can be in 2-digit format; in this case, years from 'current + 1' ('20' for 2019) to '99' interprets as 19xx, less as 20xx). 
For example, 'Иванов Пётр Васильевич м 12.3.57' or 'Smith John m 29.4.49'.
2. Check that all values shown in the string right below are correct. If there is an error in typed info, the label of the parameter will be highlighted by red color.
3. First char in every name is automatically set to upper case, other - to lower case.
4. If the name (family, first, patronymic) consists of two or more words (i.e. 'Сабир оглы'), it must be wrapped into double quotes ('Гасымов Юнис "Ибрагим оглы" м 19.12.56').
5. If all data is correct, press the button 'New patient' or Enter on a keyboard.
6. If no error occurred, you will redirect to created patient's page.

### Search, edit and delete
Smallmis has an intuitive interface for these functions :)

P.S. I am not a designer, so design leaves much to be desired :)
