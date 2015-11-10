<?php
return [
	'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=10.192.163.44;dbname=pbr-wifc-asm-test', // MySQL, MariaDB
    //'dsn' => 'sqlite:/path/to/database/file', // SQLite
    //'dsn' => 'pgsql:host=donar.immo;port=5432;dbname=pbr-wifc-asm-test', // PostgreSQL
    //'dsn' => 'cubrid:dbname=demodb;host=localhost;port=33000', // CUBRID
    //'dsn' => 'sqlsrv:Server=localhost;Database=mydatabase', // MS SQL Server, sqlsrv driver
    //'dsn' => 'dblib:host=localhost;dbname=mydatabase', // MS SQL Server, dblib driver
    //'dsn' => 'mssql:host=localhost;dbname=mydatabase', // MS SQL Server, mssql driver
    //'dsn' => 'oci:dbname=//localhost:1521/mydatabase', // Oracle
    'username' => 'worker',
    'password' => 'worker',
    'charset' => 'utf8',
	];
?>	