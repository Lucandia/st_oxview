/**
 * The abstract class that all drawn monomers inherit from
 * @param id - The global id of the element.  Also its key in the elements map
 * @param strand - The parent Strand of the monomer
 * @param dummySys - If created during editing, the data arrays for instancing are stored in a dummy system
 */

abstract class BasicElement {
    id: number; //location in world - all systems
    sid: number; //in-system ID, only used if in a temporary system
    label: string;
    n3: BasicElement | null;
    n5: BasicElement | null;
    connections: BasicElement[] = []; // ref all elements it's 'connected' to via harmonic potential (mainly for AA + networks)
    strand: Strand;
    bbnsDist : number;
    type: string; // Base as string
    clusterId: number;
    dummySys: System;
    color: THREE.Color;
    pdbindices: [number, any, any]; //Only Intialized if loaded from a PDB structure

    constructor(id: number, strand: Strand) {
        this.id = id;
        this.strand = strand;
        if (strand && strand.isEmpty()) {
            strand.setFrom(this);
        }
        this.dummySys = null;
    };

    abstract calcPositions(p: THREE.Vector3, a1?: THREE.Vector3, a3?: THREE.Vector3)
    abstract calcPositionsFromConfLine(l: string[]): void;
    abstract updateColor(): void;
    //abstract setPosition(newPos: THREE.Vector3): void; 
    abstract extendStrand(len: number, direction: string, double: boolean): void;
    abstract translatePosition(amount: THREE.Vector3): void;
    abstract getA1(): THREE.Vector3;
    abstract getA3(): THREE.Vector3;
    //abstract rotate(quat: THREE.Quaternion): void;

    getDatFileOutput(): string {
        const p = this.getPos();
        const a1 = this.getA1();
        const a3 = this.getA3();
        return `${p.x} ${p.y} ${p.z} ${a1.x} ${a1.y} ${a1.z} ${a3.x} ${a3.y} ${a3.z} 0 0 0 0 0 0\n`;
    }

    // highlight/remove highlight the bases we've clicked from the list and modify color
    toggle() {
        if (selectedBases.has(this)) {
            this.deselect();
        }
        else {
            this.select()
        }
    }

    select() {
        selectedBases.add(this);
        this.updateColor();

        const scale = 1.2;

        this.setInstanceParameter('scales', [scale, scale, scale]);
        let sys = this.dummySys ? this.dummySys : this.getSystem();
        sys.callUpdates(['instanceScale']);
    }

    deselect() {
        selectedBases.delete(this);
        this.updateColor();

        this.setInstanceParameter('scales', [1, 1, 1]);
        let sys = this.dummySys ? this.dummySys : this.getSystem();
        sys.callUpdates(['instanceScale']);
    }

    updateSP(num: number): THREE.Object3D {
        return new THREE.Object3D();
    };
    
    getSystem(): System {
        return this.strand.system;
    }

    strandToColor(strandIndex: number) {
        return backboneColors[(Math.abs(strandIndex) + this.getSystem().id) % backboneColors.length];
    };

    elemToColor(type: number | string): THREE.Color {
        return new THREE.Color();
    };

    defaultColor() {
        let sys = this.dummySys ? this.dummySys : this.getSystem();
        
        // backbone color
        const bbColor = this.strandToColor(this.strand.id);
        sys.fillVec('bbColors', 3, this.sid, [bbColor.r, bbColor.g, bbColor.b]);

        // nucleoside color
        const nsColor = this.elemToColor(this.type);
        sys.fillVec('nsColors', 3, this.sid, [nsColor.r, nsColor.g, nsColor.b]);

        // picking scene color
        let idColor = new THREE.Color();
        idColor.setHex(this.id+1); //has to be +1 or you can't grab nucleotide 0
        sys.fillVec('bbLabels', 3, this.sid, [idColor.r, idColor.g, idColor.b]);
    }

    isPaired() {
        return false;
    }

    setType(type: string) {
        this.type = type;
    }

    changeType(type: string) {
        this.setType(type);
        // Get the dummy system if it exists, otherwise get the real system
        let sys = this.getSystem();
        if (this.dummySys) {
            sys = this.dummySys
        }
        let newC = this.elemToColor(this.type);
        sys.fillVec('nsColors', 3, this.sid, [newC.r, newC.g, newC.b])
    }

    //retrieve this element's values in a 3-parameter instance array
    //positions, scales, colors
    getInstanceParameter3(name: string) {
        let sys = this.getSystem(),
            sid = this.sid;
        if (this.dummySys !== null) {
            sys = this.dummySys;
        }

        const x: number = sys[name][sid * 3],
            y: number = sys[name][sid * 3 + 1],
            z: number = sys[name][sid * 3 + 2];

        return new THREE.Vector3(x, y, z);
    }

    //retrieve this element's values in a 4-parameter instance array
    //only rotations
    getInstanceParameter4(name: string) {
        let sys = this.getSystem(),
            sid = this.sid;
        if (this.dummySys !== null) {
            sys = this.dummySys;
        }

        const x: number = sys[name][sid * 4],
            y: number = sys[name][sid * 4 + 1],
            z: number = sys[name][sid * 4 + 2],
            w: number = sys[name][sid * 4 + 3];

        return new THREE.Vector4(x, y, z, w);
    }

    //set this element's parameters in the system's instance arrays
    //doing this is slower than sys.fillVec(), but makes cleaner code sometimes
    setInstanceParameter(name:string, data) {
        let sys = this.getSystem();
        if (this.dummySys !== null) {
            sys = this.dummySys;
        } 
        sys.fillVec(name, data.length, this.sid, data);
    }

    //poof
    toggleVisibility() {
        let sys = this.getSystem();
        if (this.dummySys !== null) {
            sys = this.dummySys;
        }

        const visibility = this.getInstanceParameter3('visibility');
        visibility.addScalar(-1);

        sys.fillVec('visibility', 3, this.sid, [Math.abs(visibility.x), Math.abs(visibility.y), Math.abs(visibility.z)]);
    }

    handleCircularStrands(sys: System, sid: number, bb: THREE.Vector3) {
        if (this.n5 == this.strand.end5 && this.strand.isCircular()) { //handle circular strands
            const bbLast = new THREE.Vector3(
                sys.bbOffsets[this.n5.id * 3],
                sys.bbOffsets[this.n5.id * 3 + 1],
                sys.bbOffsets[this.n5.id * 3 + 2]
            );

            const sp = bb.clone().add(bbLast).divideScalar(2);
            const spLen = bb.distanceTo(bbLast);

            const spRotation = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                sp.clone().sub(bb).normalize()
            );

            const sid5 = this.n5.sid;

            sys.fillVec('bbconOffsets', 3, sid5, sp.toArray());
            sys.fillVec('bbconRotation', 4, sid5, [spRotation.w, spRotation.z, spRotation.y, spRotation.x]);
            sys.fillVec('bbconScales', 3, sid5, [1, spLen, 1]);
        }
    }

    // Get center of mass position
    getPos(): THREE.Vector3 {
        return this.getInstanceParameter3('cmOffsets');
    }

    isAminoAcid(): boolean {
        return false;
    }

    isNucleotide(): boolean {
        return false;
    }

    isDNA(): boolean {
        return false;
    }

    isRNA(): boolean {
        return false;
    }

    isGS() {
        return false;
    }

    isPatchyParticle() {
        return false;
    }

    toJSON() {
        // Specify required attributes
        let json = {
            id: this.id,
            type: this.type,
            class: 'monomer',
            p: this.getPos().toArray(),
            a1: this.getA1().toArray(),
            a3: this.getA3().toArray()
        };
        // Specify optional attributes
        if (this.n3) json['n3'] = this.n3.id;
        if (this.n5) json['n5'] = this.n5.id;
        if (this.label) json['label'] = this.label;
        if (this.clusterId) json['cluster'] = this.clusterId;
        if (this.color) json['color'] = this.color.getHex();

        return json;
    }

    getTypeNumber(): number {
        return 0;
    }
};