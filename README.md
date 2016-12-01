# Enigma
After watching the Imitation Game, I just had to see how one works.

This is a very basic implementation of the first generation of Enigma machines used in WWII. 

## Usage

```
var enigma = new Enigma( /* configuration */ );  // sane defaults for all configuration settings
var encrypted = enigma.encode( 'helloworld' );  // "ILBDAAMTAZ"
var original = enigma.encode( encrypted );      // "HELLOWORLD"
```

### Construction
You can configure the Enigma machine during construction.
All settings have sane defaults.
```
var wheels = [ 'RB', 'I', 'II', 'III' ]; // index 0 selects the Reflector. One of 'RA' or 'RB'
                                         // indicies 1-3 select the rotors for Left, Center and Right, respectively.
                                         // One of 'I', 'II', 'III', 'IV' or 'V'
var wheel_offset = [0, 0, 0];            // initial rotor offsets, Left to Right. 
var pegboard_mappings = ['AX','QT'];     // mappings of letters for the pegboard
var enigma = new Enigma( wheels, wheel_offsets, pegboard_mappings );
```

### Configuration
You can reconfigure after construction.
```
enigma.configure( ['RB', 'IV', 'V', 'III'], [3, 12, 4], ['RA', 'KE', 'WD'] );
```

### 
References:
* [Technical Description](http://users.telenet.be/d.rijmenants/en/enigmatech.htm)
* [Flash Reference Implementation](http://enigmaco.de/enigma/enigma.html)
* [Sample Code Book Entry](https://qph.ec.quoracdn.net/main-qimg-bd0b5173bc897178c9ceb2ecb42d49cd-c?convert_to_webp=true)
