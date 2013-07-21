<?php
/**
 * Golf Vista - config.php
 *
 * @author Josh Hutson
 * @email josh@joshhutson.com
 * @modified 07/19/2013
 * @version 1.0
 */

/**
 * Environment
 */
preg_match("/^(local|www)?(\.)?joshhutson.com$/i", getenv('HTTP_HOST'), $env);
switch(strtolower($env[1]))
{
	case 'local':
		$environment = 'LOCAL';
		break;
	case 'www':
	default:
		$environment = 'PROD';
		break;
}
define('ENVIRONMENT', $environment);

/**
 * Server and Web Root
 */
define('WEB_ROOT', '/golfvista');
define('DOCUMENT_ROOT', getenv('DOCUMENT_ROOT') . WEB_ROOT);