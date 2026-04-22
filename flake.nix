{
  description = "Awesome nix config!";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }@inputs:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs
        ];
        shellHook = ''
          echo "UI5 devShells"
        '';
      };

      #packages.x86_64-linux.default = pkgs.buildNpmPackage {
      #};
    });
}
