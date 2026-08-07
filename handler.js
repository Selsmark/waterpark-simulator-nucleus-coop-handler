// =====================================================================
// Nucleus Co-op handler for: Waterpark Simulator
// Steam AppID: 3293260
// Creator: Selsmark
// =====================================================================

// ---------------------------------------------------------------------
// 1. GAME INFO
// ---------------------------------------------------------------------
//
Game.ExecutableName = "WaterparkSimulator.exe";

Game.GUID = "WaterparkSimulator";
Game.GameName = "Waterpark Simulator";
Game.MaxPlayers = 4;
Game.MaxPlayersOneMonitor = 4;

// CRITICAL: the game's real save data (character customization, park
// progress) lives at %userprofile%\AppData\LocalLow\CayPlay\WaterparkSimulator
// — a normal Windows path tied to your ONE real Windows user account, not
// to any individual Nucleus instance. Without redirecting this, every
// instance reads/writes the exact same physical files regardless of any
// per-instance Goldberg save isolation, which is what caused both players
// to end up sharing one save. This makes Nucleus give each player their
// own fake redirected copy of this folder instead.
Game.UseNucleusEnvironment = true;
Game.UserProfileSavePath = "AppData\\LocalLow\\CayPlay\\WaterparkSimulator";
Game.Description = "This handler is for the 1.0+ release of Waterpark Simulator.\n" +
    "Host a game on the first client and join it from the other client like normal.\n" +
    "I have only tested it with two monitors and not splitscreen.\n" +
    "If it does not work as expected feel free to tag \"Selsmark\" on the Discord.";

// ---------------------------------------------------------------------
// 2. FILE SYSTEM — how each instance's copy of the game is built
// ---------------------------------------------------------------------
Game.HandlerInterval = 100;
Game.SymlinkGame = true;
Game.SymlinkExe = false;
Game.SymlinkFolders = true;
Game.HardcopyGame = false;

Game.FileSymlinkExclusions = ["steam_api64.dll", "steam_appid.txt", "xinput1_3.dll", "xinput1_4.dll"];

Game.FileSymlinkCopyInstead = ["UnityPlayer.dll"];

Game.DirSymlinkExclusions = ["WaterparkSimulator_Data\\Plugins\\x86_64"];

// ---------------------------------------------------------------------
// 3. MUTEX
// ---------------------------------------------------------------------
Game.KillMutexType = "Mutant";

// ---------------------------------------------------------------------
// 4. STEAM EMULATION
// ---------------------------------------------------------------------
Game.CreateSteamAppIdByExe = false;

// ---------------------------------------------------------------------
// 5. INPUT — Proto Input
// ---------------------------------------------------------------------
Game.SupportsMultipleKeyboardsAndMice = true;

// Deprecated fields — must be explicitly false, some default to true
Game.HookSetCursorPos = false;
Game.HookGetCursorPos = false;
Game.HookGetKeyState = false;
Game.HookGetAsyncKeyState = false;
Game.HookGetKeyboardState = false;
Game.HookFilterRawInput = false;
Game.HookFilterMouseMessages = false;
Game.HookUseLegacyInput = false;
Game.HookDontUpdateLegacyInMouseMsg = false;
Game.HookMouseVisibility = false;
Game.SendNormalMouseInput = false;
Game.SendNormalKeyboardInput = false;
Game.SendScrollWheel = false;
Game.ForwardRawKeyboardInput = false;
Game.ForwardRawMouseInput = false;
Game.HookReRegisterRawInput = false;
Game.HookReRegisterRawInputMouse = false;
Game.HookReRegisterRawInputKeyboard = false;
Game.DrawFakeMouseCursor = false;

Game.ProtoInput.InjectStartup = false;
Game.ProtoInput.InjectRuntime_RemoteLoadMethod = false;
Game.ProtoInput.InjectRuntime_EasyHookMethod = true;
Game.ProtoInput.InjectRuntime_EasyHookStealthMethod = false;

Game.LockInputAtStart = false;
Game.LockInputSuspendsExplorer = true;
Game.ProtoInput.FreezeExternalInputWhenInputNotLocked = true;
Game.LockInputToggleKey = 0x23;          // End key toggles input lock

// These should always be on regardless of lock state
Game.ProtoInput.RegisterRawInputHook = true;
Game.ProtoInput.GetRawInputDataHook = true;
Game.ProtoInput.MessageFilterHook = true;
Game.ProtoInput.ClipCursorHook = true;
Game.ProtoInput.ClipCursorHookCreatesFakeClip = true;
Game.ProtoInput.FocusHooks = true;

Game.ProtoInput.SendMouseWheelMessages = true;
Game.ProtoInput.SendMouseButtonMessages = true;
Game.ProtoInput.SendMouseMovementMessages = true;
Game.ProtoInput.SendKeyboardButtonMessages = true;

Game.ProtoInput.EnableFocusMessageLoop = true;
Game.ProtoInput.FocusLoopIntervalMilliseconds = 10000;
Game.ProtoInput.FocusLoop_WM_ACTIVATE = true;
Game.ProtoInput.WindowActivateFilter = true;

Game.ProtoInput.DrawFakeCursor = false;
Game.ProtoInput.DontShowCursorWhenImageUpdated = true;

Game.ProtoInput.BlockedMessages = [0x0008]; // WM_KILLFOCUS

Game.ProtoInput.RenameHandlesHook = false;
Game.ProtoInput.RenameHandles = [];
Game.ProtoInput.RenameNamedPipes = [];

// --- CONTROLLER SUPPORT ---
Game.Hook.XInputEnabled = true;
Game.XInputPlusDll = ["xinput1_3.dll", "xinput1_4.dll"];
Game.Hook.DInputEnabled = false;
Game.Hook.DInputForceDisable = false;
Game.Hook.XInputReroute = false;
Game.Hook.CustomDllEnabled = false;

Game.ProtoInput.XinputHook = false;
Game.ProtoInput.UseOpenXinput = false;
Game.ProtoInput.UseDinputRedirection = false;
Game.ProtoInput.DinputDeviceHook = false;

Game.ProtoInput.OnInputLocked = function () {
  for (var i = 0; i < PlayerList.Count; i++) {
    var player = PlayerList[i];

    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetCursorPosHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.SetCursorPosHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetKeyStateHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetAsyncKeyStateHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetKeyboardStateHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.CursorVisibilityStateHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.FocusHooksHookID);

    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.RawInputFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseActivateFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.WindowActivateFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.WindowActivateAppFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseWheelFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseButtonFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.KeyboardButtonFilterID);

    ProtoInput.SetDrawFakeCursor(player.ProtoInputInstanceHandle, true);
    ProtoInput.SetRawInputBypass(player.ProtoInputInstanceHandle, false);
  }
};

Game.ProtoInput.OnInputUnlocked = function () {
  for (var i = 0; i < PlayerList.Count; i++) {
    var player = PlayerList[i];

    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetCursorPosHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.SetCursorPosHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetKeyStateHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetAsyncKeyStateHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetKeyboardStateHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.CursorVisibilityStateHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.FocusHooksHookID);

    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.RawInputFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseMoveFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseActivateFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.WindowActivateFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.WindowActivateAppFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseWheelFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseButtonFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.KeyboardButtonFilterID);

    ProtoInput.SetDrawFakeCursor(player.ProtoInputInstanceHandle, false);
    ProtoInput.SetRawInputBypass(player.ProtoInputInstanceHandle, true);
  }
};

// ---------------------------------------------------------------------
// 6. WINDOW MANAGEMENT
// ---------------------------------------------------------------------
Game.DontRemoveBorders = false;
Game.NotTopMost = false;
Game.SetWindowHook = true;
Game.KeepAspectRatio = true;

Game.Hook.ForceFocusWindowName = "WaterparkSimulator";
Game.HasDynamicWindowTitle = false;
Game.SetForegroundWindowElsewhere = true;
Game.RefreshWindowAfterStart = true;
Game.ToggleUnfocusOnInputsLock = true;

// ---------------------------------------------------------------------
// 7. TIMING
// ---------------------------------------------------------------------
Game.PauseBetweenProcessGrab = 5;
Game.PauseBetweenStarts = 15;
Game.RequiresAdmin = false;

Game.Play = function () {
  Context.StartArguments = " -screen-fullscreen 0 -screen-width " + Context.Width + " -screen-height " + Context.Height;

  var dllPath = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\UnityPlayer.dll";
  var searchPattern =
    "57 00 69 00 6E 00 64 00 6F 00 77 00 73 00 2E 00 47 00 61 00 6D 00 69 00 6E 00 67 00 2E 00 49 00 6E 00 70 00 75 00 74 00 2E 00 47 00 61 00 6D 00 65 00 70 00 61 00 64";
  var patchPattern =
    "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00";
  Context.PatchFileFindPattern(dllPath, dllPath, searchPattern, patchPattern, true);

  Context.CopyFolder(
    Context.ScriptFolder,
    Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\WaterparkSimulator_Data\\Plugins\\x86_64"
  );

  var savePath =
    Context.GetFolder(Nucleus.Folder.InstancedGameFolder) +
    "\\WaterparkSimulator_Data\\Plugins\\x86_64\\steam_settings\\configs.user.ini";

  Context.ModifySaveFile(savePath, savePath, Nucleus.SaveType.INI, [
    new Nucleus.IniSaveInfo("user::general", "account_name", Context.Nickname),
    new Nucleus.IniSaveInfo("user::general", "account_steamid", Context.PlayerSteamID),
    new Nucleus.IniSaveInfo("user::general", "language", Context.SteamLang),
    // CRITICAL: without this, local_save_path is empty and Goldberg falls
    // back to ONE shared global save folder for every instance, meaning
    // both players silently read/write the exact same save file — whoever
    // saves last overwrites the other's progress. Setting a unique path per
    // player (relative to this instance's own copy of the dll) gives each
    // instance a genuinely separate save.
    new Nucleus.IniSaveInfo("user::saves", "local_save_path", "./player" + Context.PlayerID + "_save")
  ]);
};
