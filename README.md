# Employee_Tracker
Express based employee database with command line interface

## Description  

Node.js based MySql application for a simple company database.

## Usage  

Application is accessed via termianl with Node.js active/available.

'npm i' should be used to initialize/install packages.
A schema & seed tables are included that can be executed to set up and test the application.

Application is started 'node index.js'. An Inquirer prompt will open for options to select.

Several menu options are available allowing interaction with the database including viewing the tables, adding records, deleting records, and updating records.

The reports will update as changes are made so the data is effectively "live" for referencing.

GitHub Repository can be found here:

https://github.com/creechj/Employee_Tracker

Video of usage:  

https://drive.google.com/file/d/1KsDM1fvilKXw_ER8mKIaHI4zv_BHjZev/view



![Screenshot of Application](./assets/Employee_Tracker_Screenshot.png)


## Credits

database pool connection & promises:  
https://github.com/sidorares/node-mysql2#using-promise-wrapper

ON CASCADE:  
https://stackoverflow.com/questions/6720050/foreign-key-constraints-when-to-use-on-update-and-on-delete

SQL IF's:  
https://www.w3schools.com/SQL/func_mysql_if.asp

## License

Please see license in repository for this application