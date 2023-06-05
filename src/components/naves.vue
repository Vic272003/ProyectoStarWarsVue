<script>
import { computed } from '@vue/reactivity';

export default {

    methods: {
        addPilotToStarship(starshipId, pilotId) {
            //Variables alertas y gif
            console.log("entra");
            this.loading = true;
            this.aniadePiloto = false;
            this.aniadePilotoFalse = false;
            //Fin variables alertas y gif

            this.$axios
                .post("addPilotToStarship/" + starshipId, {
                    pilot_id: pilotId
                })
                .then((response) => {
                    console.log(response);
                    this.aniadePiloto = true;
                    // Si la llamada HTTP fue exitosa, actualiza la lista de naves
                    this.$axios.get("pilotosDeNaves")
                        .then((response) => {
                            console.log(response.data);
                            this.navesConPilotos = response.data;

                            this.aniadePiloto = true;
                            this.loading = false;
                        });
                })
                .catch((data, status) => {
                    this.loading = false;
                    this.aniadePiloto = false;
                    this.aniadePilotoFalse = true;


                })
        },
        eliminar(starshipName, pilotName) {
            //Variables para las alertas y gif
            this.loading = true;
            this.pilotoBorrar = false;
            //fin Variables para las alertas
            // Hacer la llamada DELETE a la API
            let naves = this.navesConPilotos;
            this.$axios.delete('starships/' + starshipName + '/pilots/' + pilotName).then( (response)=> {
                console.log(response);
                //Variable para la alerta
                this.pilotoBorrar = true;
                //Fin variable alerta

                // Si la eliminación fue exitosa, eliminar el piloto de la lista en la vista
                // por ejemplo:

                let nave = naves.find(function (s) {
                    return s.name === starshipName;
                });
                if (nave) {
                    var index = nave.pilots.findIndex(function (p) {
                        return p.name === pilotName;
                    });
                    if (index !== -1) {
                        nave.pilots.splice(index, 1);
                    }
                }
                this.loading = false;
            }, (error) => {
                // Si hay un error, manejarlo aquí
            });
        }
    },
    mounted() {
        this.$axios
            .get("pilotosDeNaves")
            .then((response) => {
                // Manejar la respuesta exitosa
                this.navesConPilotos = response.data;
                this.priceToBase15 = function (price) {
                    var base15 = "";
                    var symbols = "0123456789ßÞ¢μ¶"; //Símbolos que vamos a usar
                    //Mientras el precio sea mayor que 0
                    while (price > 0) {
                        var remainder = price % 15; //Sacamos el resto de la división
                        base15 = symbols.charAt(remainder) + base15; //Sacamos el símbolo que es
                        price = Math.floor(price / 15); //Y luego hacemos la división del precio entre 15
                    }
                    //Una vez termine el bucle lo devolvemos
                    return base15;
                };
            })
            .catch((error) => {
                // Manejar errores
                console.error(error);
            });
        this.$axios.get("pilot").then((response) => {
            this.pilots = response.data;
        });

    },
    data() {
        return {
            navesConPilotos: [],
            pilots: [],
            selectedPilot: [],
            loading: Boolean = false,
            aniadePiloto: Boolean = false,
            aniadePilotoFalse: Boolean = false,
            pilotoBorrar:Boolean=false,
        };
    },
};

</script>

<template>
    <!-- <a class="volver btn btn-warning btn-lg" href="/">Inicio<i class="fa fa-home ms-3"></i></a>
            <a class="siguiente btn btn-warning btn-lg" href="/pilots">Pilotos<i class="fa fa-arrow-right ms-3"></i></a> -->
    <img id="loader" src="../assets/imperialLoader.gif" v-show="loading">
    <div id="naves">
        <h2>Naves con sus respectivos pilotos y precios</h2>
        
        <div class="alert alert-success flex flex-row-reverse" role="alert" v-if="aniadePiloto">
            <p>Piloto añadido correctamente mi pequeño Padawan!</p>
            <button type="button" class="btn-square ms-5 " data-bs-dismiss="alert" aria-label="Close"
                @click="aniadePiloto = false"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg></button>
        </div>
        <div class="alert alert-success" role="alert" v-if="pilotoBorrar">
            Piloto añadido correctamente mi pequeño Padawan!
            <button type="button" class="btn-square " data-bs-dismiss="alert" aria-label="Close"
                @click="pilotoBorrar = false"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg></button>
        </div>
        <div class="alert alert-success" role="alert" v-if="aniadePilotoFalse">
            Se ha intentado añadir un piloto que ya estaba añadido
            <button type="button" class="btn-square " data-bs-dismiss="alert" aria-label="Close"
                @click="aniadePilotoFalse = false"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg></button>
        </div>
        <div id="todasNaves" class="scroll">
            <div id="nave" v-for="(nave, index) in navesConPilotos">
                <h3 id="nombreNave">{{ nave.name }}</h3>
                <div>
                    <p><span>Modelo</span>: {{ nave.model }}</p>
                    <p v-if="nave.cost_in_credits != 'unknown'">
                        <span>Precio</span>: {{ priceToBase15(nave.cost_in_credits) }}
                    </p>
                    <p v-if="nave.cost_in_credits == 'unknown'">
                        <span>Precio</span>: {{ priceToBase15(200) }}
                    </p>
                    <div id="pilotosNave">
                        <p><span>Pilotos</span>:</p>
                        <ul v-if="nave.pilots == ''">
                            <li>No hay pilotos en esta nave</li>
                        </ul>
                        <ul>
                            <li id="modPiloto"  v-for="pilot in nave.pilots">
                                {{ pilot.name
                                }}<button type="button" @click="eliminar(nave.name, pilot.name)"
                                    class="btn btn-xs btn-square btn-outline"><svg xmlns="http://www.w3.org/2000/svg"
                                        class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg></button>
                            </li>
                        </ul>
                    </div>
                </div>
                <p class="aniadirPiloto mt-2 mb-2" id="aniadirPiloto[index]">
                    <select class="select select-accent   select-sm" v-model="selectedPilot[index]">
                        <option v-for="pilot in pilots" :key="pilot.id" :value="pilot.id">
                            {{ pilot.name }}
                        </option>
                    </select>
                    <button class="btn btn-warning btn-sm ml-2"
                        @click="addPilotToStarship(nave.id, selectedPilot[index])">Añadir</button>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
#loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100000;
    width: 100%;
}

h2 {
    font-family: "Arial Black", Gadget, sans-serif;
    color: #ffffff;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1em;
    margin-top: 50px;
}

h2 span {
    display: block;
    font-size: 1.25rem;
    font-family: "Comic Sans MS", cursive, sans-serif;
    color: #5283a3;
}

div {
    display: inline-block;
    padding-top: 0.5em;
}

ul,
ul li {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
}
#nombreNave{
    font-size: x-large;
}


/* Naves */
#naves {
    color: white;
}

#todasNaves {
    height: 550px;
    /* overflow: auto; */
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    width: 90%;
    margin: auto;
}

.scroll {
    overflow: auto;
    scrollbar-width: thin;
    /* Ancho del scrollbar */
    scrollbar-color: #d6d614 #cccccc;
    /*Color del thumb y del track*/
}

.scroll::-webkit-scrollbar {
    width: 15px;
    /* Ancho del scrollbar */
    margin-left: 15px;
}

.scroll::-webkit-scrollbar-track {
    background-color: #cccccc;
    /* Color del track */
    border-radius: 10px;
}

.scroll::-webkit-scrollbar-thumb {
    background-color: #d6d614;
    /* Color del thumb */
    border-radius: 10px;
    /* Hace más redondo el scrollbar */
    border: 2px solid black;
}

#todasNaves h3,
#todasNaves span {
    font-weight: bold;
}

#nave {
    border: 2px solid rgb(214, 214, 20);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background: rgb(0, 0, 0);
    background: linear-gradient(187deg,
            rgba(0, 0, 0, 0.8711134111847865) 9%,
            rgba(4, 4, 4, 0.6498248957786239) 26%);
    height: 300px;
}

.bton-eliminar {
    background-color: white;
}

#modPiloto {
    display: flex;
    justify-content: space-between;
}

#pilotosNave ul {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

#pilotosNave ul li button {
    margin-left: 10px;
}

.volver {
    position: absolute;
    top: 0;
    left: 0;
    margin: 10px;
    font-weight: bold;
}

/* Pilotos */

#pilotos {
    color: white;
}

#todosPilotos {
    height: 550px;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 20px;
    width: 90%;
    margin: auto;
}

#todosPilotos h3,
#todosPilotos span {
    font-weight: bold;
}

#piloto {
    border: 2px solid rgb(214, 214, 20);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: rgb(0, 0, 0);
    background: linear-gradient(187deg,
            rgba(0, 0, 0, 0.8711134111847865) 9%,
            rgba(4, 4, 4, 0.6498248957786239) 26%);
}

.bton-eliminar {
    background-color: white;
}

.siguiente {
    float: right;
    top: 0;
    right: 0;
    margin: 10px;
    font-weight: bold;
}</style>
