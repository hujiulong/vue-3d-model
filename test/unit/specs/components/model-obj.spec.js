import { createVue, destroyVM } from '../../util';

describe( 'model-obj', () => {
    let vm;
    afterEach( () => {
        destroyVM( vm );
    } );

    it( 'create', done => {
        vm = createVue( {
            template: `
                <model-obj />
            `,
            data() {
                return {};
            }
        }, true );
        const elm = vm.$el;
        expect( elm.textContent.indexOf( 'Your browser does not seem to support WebGL' ) > -1 ).to.be.true;

        done();
    } );

} );
