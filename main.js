define( function( require, exports, module )
{
	"use strict";

	// Modules
	var app_init		= brackets.getModule( "utils/AppInit" );
	var cm_manager		= brackets.getModule( "command/CommandManager" );
	var e_manager		= brackets.getModule( "editor/EditorManager" );
	var menus			= brackets.getModule( "command/Menus" );
	var prefs_manager	= brackets.getModule( "preferences/PreferencesManager" );
	var statusbar		= brackets.getModule( "widgets/StatusBar" );

	// Action
	app_init.appReady( function()
	{
		// Settings
		var cm_id		= "starboy.hideStatusBar.toggle";
		var prefs_id	= "starboy.hideStatusBar";
		var prefs_def	= { show: false };

		// Declaration
		var prefs, cm;

		// Action
		function e_action()
		{
			if( cm.getChecked())	statusbar.show();
			else					statusbar.hide();
		}

		// Event handlers
		function cm_handler()
		{
			if( cm.getChecked())	cm.setChecked( false );
			else					cm.setChecked( true );
		}
		function state_handler()
		{
			prefs.set( "show", Boolean( cm.getChecked()));
			e_action();
		}
		function e_handler()
		{
			e_action();
		}

		// Preferences
		prefs = prefs_manager.getExtensionPrefs( prefs_id );
		prefs.definePreference( "show", "boolean", prefs_def[ "show" ]);

		// Command
		cm = cm_manager.get( cm_id );
		if ( cm )	cm._commandFn	= cm_handler;
		else		cm				= cm_manager.register( "Status bar", cm_id, cm_handler );
		$( cm ).on( "checkedStateChange", state_handler );
		cm.setChecked( prefs.get( "show" ));

		// Menu
		menus.getMenu( "view-menu" ).addMenuItem( cm_id );

		// Sync
		$( e_manager ).on( "activeEditorChange", e_handler );
	});
});
