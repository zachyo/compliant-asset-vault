pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template KYC() {
    // Private inputs
    signal input secret;
    
    // Public inputs
    signal input identityCommitment;

    // Components
    component hasher = Poseidon(1);
    hasher.inputs[0] <== secret;

    // Constraints
    hasher.out === identityCommitment;
}

component main {public [identityCommitment]} = KYC();
