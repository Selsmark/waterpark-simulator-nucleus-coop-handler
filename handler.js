// Waterpark Simulator — Nucleus Co-op handler
// AppID 3293260 | by Selsmark

Game.GameName = "Waterpark Simulator";
Game.ExecutableName = "WaterparkSimulator.exe";
Game.GUID = "WaterparkSimulator";
Game.MaxPlayers = 4;
Game.MaxPlayersOneMonitor = 4;
Game.Description = "This handler is for the 1.0+ release of Waterpark Simulator.\n" +
    "Host a game on the first client and join it from the other client like normal.\n" +
    "I have only tested it with two monitors and not splitscreen.\n" +
    "If it does not work as expected feel free to tag \"Selsmark\" on the Discord.";

// --- copy/link behaviour ---
Game.SymlinkGame = true;
Game.SymlinkFolders = true;
Game.SymlinkExe = false;
Game.HardcopyGame = false;
Game.HandlerInterval = 100;
Game.DirSymlinkExclusions = ["WaterparkSimulator_Data\\Plugins\\x86_64"];
Game.FileSymlinkCopyInstead = ["UnityPlayer.dll"];
Game.FileSymlinkExclusions = ["xinput1_3.dll", "xinput1_4.dll", "steam_appid.txt", "steam_api64.dll"];

Game.KillMutexType = "Mutant";
Game.CreateSteamAppIdByExe = false;

// --- window handling ---
Game.KeepAspectRatio = true;
Game.SetWindowHook = true;
Game.NotTopMost = false;
Game.DontRemoveBorders = false;
Game.HasDynamicWindowTitle = false;
Game.Hook.ForceFocusWindowName = "WaterparkSimulator";
Game.RefreshWindowAfterStart = true;
Game.SetForegroundWindowElsewhere = true;
Game.ToggleUnfocusOnInputsLock = true;

// --- timing ---
Game.RequiresAdmin = false;
Game.PauseBetweenProcessGrab = 5;
Game.PauseBetweenStarts = 15;

// --- controller routing
Game.XInputPlusDll = ["xinput1_3.dll", "xinput1_4.dll"];
Game.Hook.XInputEnabled = true;
Game.Hook.XInputReroute = false;
Game.Hook.DInputEnabled = false;
Game.Hook.DInputForceDisable = false;
Game.Hook.CustomDllEnabled = false;
Game.ProtoInput.XinputHook = false;
Game.ProtoInput.UseOpenXinput = false;
Game.ProtoInput.DinputDeviceHook = false;
Game.ProtoInput.UseDinputRedirection = false;

// --- input plumbing ---
Game.SupportsMultipleKeyboardsAndMice = true;
Game.LockInputAtStart = false;
Game.LockInputSuspendsExplorer = true;
Game.LockInputToggleKey = 0x23; // End
Game.ProtoInput.FreezeExternalInputWhenInputNotLocked = true;

Game.ProtoInput.InjectRuntime_EasyHookMethod = true;
Game.ProtoInput.InjectRuntime_EasyHookStealthMethod = false;
Game.ProtoInput.InjectRuntime_RemoteLoadMethod = false;
Game.ProtoInput.InjectStartup = false;

Game.ProtoInput.FocusHooks = true;
Game.ProtoInput.ClipCursorHook = true;
Game.ProtoInput.ClipCursorHookCreatesFakeClip = true;
Game.ProtoInput.MessageFilterHook = true;
Game.ProtoInput.GetRawInputDataHook = true;
Game.ProtoInput.RegisterRawInputHook = true;

Game.ProtoInput.SendKeyboardButtonMessages = true;
Game.ProtoInput.SendMouseMovementMessages = true;
Game.ProtoInput.SendMouseButtonMessages = true;
Game.ProtoInput.SendMouseWheelMessages = true;

Game.ProtoInput.WindowActivateFilter = true;
Game.ProtoInput.FocusLoop_WM_ACTIVATE = true;
Game.ProtoInput.FocusLoopIntervalMilliseconds = 10000;
Game.ProtoInput.EnableFocusMessageLoop = true;

Game.ProtoInput.DontShowCursorWhenImageUpdated = true;
Game.ProtoInput.DrawFakeCursor = false;
Game.ProtoInput.BlockedMessages = [0x0008]; // WM_KILLFOCUS

Game.ProtoInput.RenameHandles = [];
Game.ProtoInput.RenameNamedPipes = [];
Game.ProtoInput.RenameHandlesHook = false;

// Fields the docs mark as legacy/deprecated
[
  "HookSetCursorPos", "HookGetCursorPos", "HookGetKeyState", "HookGetAsyncKeyState",
  "HookGetKeyboardState", "HookFilterRawInput", "HookFilterMouseMessages",
  "HookUseLegacyInput", "HookDontUpdateLegacyInMouseMsg", "HookMouseVisibility",
  "SendNormalMouseInput", "SendNormalKeyboardInput", "SendScrollWheel",
  "ForwardRawKeyboardInput", "ForwardRawMouseInput", "HookReRegisterRawInput",
  "HookReRegisterRawInputMouse", "HookReRegisterRawInputKeyboard", "DrawFakeMouseCursor"
].forEach(function (field) { Game[field] = false; });

// Hook IDs that need installing on lock / uninstalling on unlock
var LOCK_HOOKS = [
  "GetCursorPosHookID", "SetCursorPosHookID", "GetKeyStateHookID",
  "GetAsyncKeyStateHookID", "GetKeyboardStateHookID", "CursorVisibilityStateHookID",
  "FocusHooksHookID"
];
var LOCK_FILTERS = [
  "RawInputFilterID", "MouseActivateFilterID", "WindowActivateFilterID",
  "WindowActivateAppFilterID", "MouseWheelFilterID", "MouseButtonFilterID",
  "KeyboardButtonFilterID"
];

Game.ProtoInput.OnInputLocked = function () {
  for (var idx = 0; idx < PlayerList.Count; idx++) {
    var handle = PlayerList[idx].ProtoInputInstanceHandle;
    LOCK_HOOKS.forEach(function (id) { ProtoInput.InstallHook(handle, ProtoInput.Values[id]); });
    LOCK_FILTERS.forEach(function (id) { ProtoInput.EnableMessageFilter(handle, ProtoInput.Values[id]); });
    ProtoInput.SetDrawFakeCursor(handle, true);
    ProtoInput.SetRawInputBypass(handle, false);
  }
};

Game.ProtoInput.OnInputUnlocked = function () {
  for (var idx = 0; idx < PlayerList.Count; idx++) {
    var handle = PlayerList[idx].ProtoInputInstanceHandle;
    LOCK_HOOKS.forEach(function (id) { ProtoInput.UninstallHook(handle, ProtoInput.Values[id]); });
    LOCK_FILTERS.concat(["MouseMoveFilterID"]).forEach(function (id) {
      ProtoInput.DisableMessageFilter(handle, ProtoInput.Values[id]);
    });
    ProtoInput.SetDrawFakeCursor(handle, false);
    ProtoInput.SetRawInputBypass(handle, true);
  }
};

Game.Play = function () {
  Context.StartArguments = " -screen-fullscreen 0 -screen-width " + Context.Width + " -screen-height " + Context.Height;

  var targetDll = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\UnityPlayer.dll";
  var findBytes = "57 00 69 00 6E 00 64 00 6F 00 77 00 73 00 2E 00 47 00 61 00 6D 00 69 00 6E 00 67 00 2E 00 49 00 6E 00 70 00 75 00 74 00 2E 00 47 00 61 00 6D 00 65 00 70 00 61 00 64";
  var wipeBytes = "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00";
  Context.PatchFileFindPattern(targetDll, targetDll, findBytes, wipeBytes, true);

  var pluginsDir = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\WaterparkSimulator_Data\\Plugins\\x86_64";
  Context.CopyFolder(Context.ScriptFolder, pluginsDir);

  var identityFile = pluginsDir + "\\steam_settings\\configs.user.ini";
  Context.ModifySaveFile(identityFile, identityFile, Nucleus.SaveType.INI, [
    new Nucleus.IniSaveInfo("user::general", "account_name", Context.Nickname),
    new Nucleus.IniSaveInfo("user::general", "account_steamid", Context.PlayerSteamID),
    new Nucleus.IniSaveInfo("user::general", "language", Context.SteamLang)
  ]);
};
