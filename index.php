<?php
/**
 * Golf Vista
 *
 * @author Josh Hutson
 * @email josh@joshhutson.com
 * @modified 07/19/2013
 * @version 1.0
 */

/**
 * Configuration
 */
require dirname(__FILE__) . '/app/config.php';

switch(ENVIRONMENT)
{
	case 'LOCAL':
		$form['api'] = '';
		break;

	case 'PROD':
		$form['action'] = '';
		break;
}

/**
 * View
 */
require DOCUMENT_ROOT . '/app/views/home.php';