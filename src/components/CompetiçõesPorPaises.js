import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CompeticaoCardComponent from "./CompeticaoCardComponent";
import Flag from "react-native-flags";

// Mapeamento dos nomes dos países e seus respectivos códigos de bandeira
const countryNames = {
  Afghanistan: "Afeganistão",
  Albania: "Albânia",
  Algeria: "Argélia",
  Andorra: "Andorra",
  Angola: "Angola",
  "Antigua-and-Barbuda": "Antígua e Barbuda",
  Argentina: "Argentina",
  Armenia: "Armênia",
  Australia: "Austrália",
  Austria: "Áustria",
  Azerbaijan: "Azerbaijão",
  Bahamas: "Bahamas",
  Bahrain: "Bahrein",
  Bangladesh: "Bangladesh",
  Barbados: "Barbados",
  Belarus: "Bielorrússia",
  Belgium: "Bélgica",
  Belize: "Belize",
  Benin: "Benin",
  Bhutan: "Butão",
  Bolivia: "Bolívia",
  "Bosnia-and-Herzegovina": "Bósnia e Herzegovina",
  Botswana: "Botswana",
  Brazil: "Brasil",
  Brunei: "Brunei",
  Bulgaria: "Bulgária",
  Burkina_Faso: "Burquina Faso",
  Burundi: "Burundi",
  "Cabo-Verde": "Cabo Verde",
  Cambodia: "Camboja",
  Cameroon: "Camarões",
  Canada: "Canadá",
  "Central-African-Republic": "República Centro-Africana",
  Chad: "Chade",
  Chile: "Chile",
  China: "China",
  Colombia: "Colômbia",
  Comoros: "Comores",
  Congo: "Congo",
  "Costa-Rica": "Costa Rica",
  Croatia: "Croácia",
  Cuba: "Cuba",
  Cyprus: "Chipre",
  "Czech-Republic": "República Tcheca",
  Denmark: "Dinamarca",
  Djibouti: "Djibuti",
  Dominica: "Dominica",
  "Dominican-Republic": "República Dominicana",
  "East-Timor": "Timor-Leste",
  Ecuador: "Equador",
  Egypt: "Egito",
  England: "Inglaterra",
  "El-Salvador": "El Salvador",
  "Equatorial-Guinea": "Guiné Equatorial",
  Eritrea: "Eritreia",
  Estonia: "Estônia",
  Eswatini: "Essuatíni",
  Ethiopia: "Etiópia",
  Fiji: "Fiji",
  Finland: "Finlândia",
  France: "França",
  Gabon: "Gabão",
  Gambia: "Gâmbia",
  Georgia: "Geórgia",
  Germany: "Alemanha",
  Ghana: "Gana",
  Greece: "Grécia",
  Grenada: "Granada",
  Guatemala: "Guatemala",
  Guinea: "Guiné",
  "Guinea-Bissau": "Guiné-Bissau",
  Guyana: "Guiana",
  Haiti: "Haiti",
  Honduras: "Honduras",
  Hungary: "Hungria",
  Iceland: "Islândia",
  India: "Índia",
  Indonesia: "Indonésia",
  Iran: "Irã",
  Iraq: "Iraque",
  Ireland: "Irlanda",
  Israel: "Israel",
  Italy: "Itália",
  Jamaica: "Jamaica",
  Japan: "Japão",
  Jordan: "Jordânia",
  Kazakhstan: "Cazaquistão",
  Kenya: "Quênia",
  Kiribati: "Quiribati",
  "Korea-North": "Coreia do Norte",
  "Korea-South": "Coreia do Sul",
  Kosovo: "Kosovo",
  Kuwait: "Kuwait",
  Kyrgyzstan: "Quirguistão",
  Laos: "Laos",
  Latvia: "Letônia",
  Lebanon: "Líbano",
  Lesotho: "Lesoto",
  Liberia: "Libéria",
  Libya: "Líbia",
  Liechtenstein: "Liechtenstein",
  Lithuania: "Lituânia",
  Luxembourg: "Luxemburgo",
  Madagascar: "Madagáscar",
  Malawi: "Malawi",
  Malaysia: "Malásia",
  Maldives: "Maldivas",
  Mali: "Mali",
  Malta: "Malta",
  "Marshall-Islands": "Ilhas Marshall",
  Mauritania: "Mauritânia",
  Mauritius: "Maurício",
  Mexico: "México",
  Micronesia: "Micronésia",
  Moldova: "Moldova",
  Monaco: "Mônaco",
  Mongolia: "Mongólia",
  Montenegro: "Montenegro",
  Morocco: "Marrocos",
  Mozambique: "Moçambique",
  Myanmar: "Mianmar",
  Namibia: "Namíbia",
  Nauru: "Nauru",
  "New-Zealand": "Nova Zelândia",
  Nepal: "Nepal",
  Netherlands: "Países Baixos",
  Nicaragua: "Nicarágua",
  Niger: "Níger",
  Nigeria: "Nigéria",
  "North-Macedonia": "Macedônia do Norte",
  Norway: "Noruega",
  Oman: "Omã",
  Pakistan: "Paquistão",
  Palau: "Palau",
  Panama: "Panamá",
  "Papua-New-Guinea": "Papua-Nova Guiné",
  Paraguay: "Paraguai",
  Peru: "Peru",
  Philippines: "Filipinas",
  Poland: "Polônia",
  Portugal: "Portugal",
  Qatar: "Catar",
  Romania: "Romênia",
  Russia: "Rússia",
  Rwanda: "Ruanda",
  "Saint-Kitts-and-Nevis": "São Cristóvão e Nevis",
  "Saint-Lucia": "Santa Lúcia",
  "Saint-Vincent-and-the-Grenadines": "São Vicente e Granadinas",
  Samoa: "Samoa",
  "San-Marino": "San Marino",
  "Sao-Tome-and-Principe": "São Tomé e Príncipe",
  "Saudi-Arabia": "Arábia Saudita",
  Scotland: "Escócia",
  Senegal: "Senegal",
  Serbia: "Sérvia",
  Seychelles: "Seicheles",
  "Sierra-Leone": "Serra Leoa",
  Singapore: "Singapura",
  Slovakia: "Eslováquia",
  Slovenia: "Eslovênia",
  "Solomon-Islands": "Ilhas Salomão",
  Somalia: "Somália",
  "South-Africa": "África do Sul",
  "South-Sudan": "Sudão do Sul",
  Spain: "Espanha",
  "Sri-Lanka": "Sri Lanka",
  Sudan: "Sudão",
  Suriname: "Suriname",
  Sweden: "Suécia",
  Switzerland: "Suíça",
  Syria: "Síria",
  Taiwan: "Taiwan",
  Tajikistan: "Tajiquistão",
  Tanzania: "Tanzânia",
  Thailand: "Tailândia",
  Togo: "Togo",
  Tonga: "Tonga",
  "Trinidad-and-Tobago": "Trinidad e Tobago",
  Tunisia: "Tunísia",
  Turkey: "Turquia",
  Turkmenistan: "Turcomenistão",
  Tuvalu: "Tuvalu",
  Uganda: "Uganda",
  Ukraine: "Ucrânia",
  "United-Arab-Emirates": "Emirados Árabes Unidos",
  "United-Kingdom": "Reino Unido",
  USA: "Estados Unidos",
  Uruguay: "Uruguai",
  Uzbekistan: "Uzbequistão",
  Vanuatu: "Vanuatu",
  "Vatican-City": "Vaticano",
  Venezuela: "Venezuela",
  Vietnam: "Vietnã",
  Yemen: "Iémen",
  Wales: "País de Gales",
  Zambia: "Zâmbia",
  Zimbabwe: "Zimbábue",
  World: "Mundo",
};

const countryCodes = {
  Afghanistan: "AF",
  Albania: "AL",
  Algeria: "DZ",
  Andorra: "AD",
  Angola: "AO",
  "Antigua-and-Barbuda": "AG",
  Argentina: "AR",
  Armenia: "AM",
  Australia: "AU",
  Austria: "AT",
  Azerbaijan: "AZ",
  Bahamas: "BS",
  Bahrain: "BH",
  Bangladesh: "BD",
  Barbados: "BB",
  Belarus: "BY",
  Belgium: "BE",
  Belize: "BZ",
  Benin: "BJ",
  Bhutan: "BT",
  Bolivia: "BO",
  "Bosnia-and-Herzegovina": "BA",
  Botswana: "BW",
  Brazil: "BR",
  Brunei: "BN",
  Bulgaria: "BG",
  "Burkina-Faso": "BF",
  Burundi: "BI",
  "Cabo-Verde": "CV",
  Cambodia: "KH",
  Cameroon: "CM",
  Canada: "CA",
  "Central-African-Republic": "CF",
  Chad: "TD",
  Chile: "CL",
  China: "CN",
  Colombia: "CO",
  Comoros: "KM",
  Congo: "CG",
  "Costa-Rica": "CR",
  Croatia: "HR",
  Cuba: "CU",
  Cyprus: "CY",
  "Czech-Republic": "CZ",
  Denmark: "DK",
  Djibouti: "DJ",
  Dominica: "DM",
  "Dominican-Republic": "DO",
  "East-Timor": "TL",
  Ecuador: "EC",
  Egypt: "EG",
  England: "GB",
  "El-Salvador": "SV",
  "Equatorial-Guinea": "GQ",
  Eritrea: "ER",
  Estonia: "EE",
  Eswatini: "SZ",
  Ethiopia: "ET",
  Fiji: "FJ",
  Finland: "FI",
  France: "FR",
  Gabon: "GA",
  Gambia: "GM",
  Georgia: "GE",
  Germany: "DE",
  Ghana: "GH",
  Greece: "GR",
  Grenada: "GD",
  Guatemala: "GT",
  Guinea: "GN",
  "Guinea-Bissau": "GW",
  Guyana: "GY",
  Haiti: "HT",
  Honduras: "HN",
  Hungary: "HU",
  Iceland: "IS",
  India: "IN",
  Indonesia: "ID",
  Iran: "IR",
  Iraq: "IQ",
  Ireland: "IE",
  Israel: "IL",
  Italy: "IT",
  Jamaica: "JM",
  Japan: "JP",
  Jordan: "JO",
  Kazakhstan: "KZ",
  Kenya: "KE",
  Kiribati: "KI",
  "Korea-North": "KP",
  "Korea-South": "KR",
  Kosovo: "XK",
  Kuwait: "KW",
  Kyrgyzstan: "KG",
  Laos: "LA",
  Latvia: "LV",
  Lebanon: "LB",
  Lesotho: "LS",
  Liberia: "LR",
  Libya: "LY",
  Liechtenstein: "LI",
  Lithuania: "LT",
  Luxembourg: "LU",
  Madagascar: "MG",
  Malawi: "MW",
  Malaysia: "MY",
  Maldives: "MV",
  Mali: "ML",
  Malta: "MT",
  "Marshall-Islands": "MH",
  Mauritania: "MR",
  Mauritius: "MU",
  Mexico: "MX",
  Micronesia: "FM",
  Moldova: "MD",
  Monaco: "MC",
  Mongolia: "MN",
  Montenegro: "ME",
  Morocco: "MA",
  Mozambique: "MZ",
  Myanmar: "MM",
  Namibia: "NA",
  Nauru: "NR",
  "New-Zealand": "NZ",
  Nepal: "NP",
  Netherlands: "NL",
  Nicaragua: "NI",
  Niger: "NE",
  Nigeria: "NG",
  "North-Macedonia": "MK",
  Norway: "NO",
  Oman: "OM",
  Pakistan: "PK",
  Palau: "PW",
  Panama: "PA",
  "Papua-New-Guinea": "PG",
  Paraguay: "PY",
  Peru: "PE",
  Philippines: "PH",
  Poland: "PL",
  Portugal: "PT",
  Qatar: "QA",
  Romania: "RO",
  Russia: "RU",
  Rwanda: "RW",
  "Saint-Kitts-and-Nevis": "KN",
  "Saint-Lucia": "LC",
  "Saint-Vincent-and-the-Grenadines": "VC",
  Samoa: "WS",
  "San-Marino": "SM",
  "Sao-Tome-and-Principe": "ST",
  "Saudi-Arabia": "SA",
  Scotland: "GB",
  Senegal: "SN",
  Serbia: "RS",
  Seychelles: "SC",
  "Sierra-Leone": "SL",
  Singapore: "SG",
  Slovakia: "SK",
  Slovenia: "SI",
  "Solomon-Islands": "SB",
  Somalia: "SO",
  "South-Africa": "ZA",
  "South-Sudan": "SS",
  Spain: "ES",
  "Sri-Lanka": "LK",
  Sudan: "SD",
  Suriname: "SR",
  Sweden: "SE",
  Switzerland: "CH",
  Syria: "SY",
  Taiwan: "TW",
  Tajikistan: "TJ",
  Tanzania: "TZ",
  Thailand: "TH",
  Togo: "TG",
  Tonga: "TO",
  "Trinidad-and-Tobago": "TT",
  Tunisia: "TN",
  Turkey: "TR",
  Turkmenistan: "TM",
  Tuvalu: "TV",
  Uganda: "UG",
  Ukraine: "UA",
  "United-Arab-Emirates": "AE",
  "United-Kingdom": "GB",
  USA: "US",
  Uruguay: "UY",
  Uzbekistan: "UZ",
  Vanuatu: "VU",
  "Vatican-City": "VA",
  Venezuela: "VE",
  Vietnam: "VN",
  Yemen: "YE",
  Wales: "GB",
  Zambia: "ZM",
  Zimbabwe: "ZW",
  World: "WLD",
};

// Componente que renderiza as competições por país
const CompeticoesPorPaisComponent = ({ jogosPorPais }) => {
  // Estado para controlar quais países estão expandidos
  const [expandedCountries, setExpandedCountries] = useState({});

  // Função para alternar o estado de expandir/colapsar para um país específico
  const toggleExpand = (pais) => {
    setExpandedCountries((prevState) => ({
      // Inverte o estado de expandido para o país
      ...prevState,
      [pais]: !prevState[pais],
    }));
  };

  // Ordena os países em ordem alfabética, usando o nome traduzido, se disponível
  const sortedCountries = Object.keys(jogosPorPais).sort((a, b) => {
    const nameA = countryNames[a] || a; // Nome do país ou o próprio código, caso não tenha tradução
    const nameB = countryNames[b] || b;
    return nameA.localeCompare(nameB); // Comparação alfabética
  });

  return (
    <View style={styles.container}>
      {/* Lista de países com competições */}
      <FlatList
        data={sortedCountries} // Dados a serem exibidos, que são os países ordenados
        keyExtractor={(item) => item} // Cada item é único baseado no nome do país
        renderItem={({ item: pais }) => {
          const competicoes = jogosPorPais[pais]; // Competicoes do país
          const isExpanded = expandedCountries[pais]; // Estado de expandido para o país
          const translatedName = countryNames[pais] || pais; // Nome traduzido do país
          const flagCode = countryCodes[pais] || "UN"; // Código da bandeira ou código padrão "UN"

          // Calcula o total de jogos e jogos finalizados
          const totalJogos = competicoes.reduce(
            (acc, competicao) => acc + competicao.jogos.length, // Soma os jogos de todas as competições
            0
          );
          const totalFinalizados = competicoes.reduce(
            (acc, competicao) =>
              acc + competicao.jogos.filter((jogo) => jogo.finalizado).length, // Soma os jogos finalizados
            0
          );

          return (
            <View style={styles.paisContainer}>
              {/* Cabeçalho do país com bandeira, nome e número de jogos */}
              <TouchableOpacity onPress={() => toggleExpand(pais)}>
                <View style={styles.paisHeader}>
                  {/* Exibe a bandeira do país usando o código */}
                  <Flag code={flagCode} size={32} />
                  {/* Exibe o nome do país */}
                  <Text style={styles.paisTitulo}>{translatedName}</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "bold",
                      color: "#fff",
                      marginLeft: "10%", // Estilo de espaçamento
                    }}
                  >
                    {totalJogos} Jogos {/* Exibe o total de jogos */}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Se o país estiver expandido, renderiza as competições */}
              {isExpanded &&
                competicoes.map((competicao, index) => {
                  const totalJogosCompeticao = competicao.jogos.length; // Total de jogos da competição
                  const finalizados = competicao.jogos.filter(
                    (jogo) => jogo.finalizado // Filtra os jogos finalizados
                  ).length;
                  return (
                    <CompeticaoCardComponent
                      key={index}
                      imagem={competicao.imagem} // Imagem da competição
                      nome={competicao.nome} // Nome da competição
                      quantidadeJogos={totalJogosCompeticao} // Total de jogos
                      jogos={competicao.jogos} // Lista de jogos
                    />
                  );
                })}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  paisContainer: {
    marginBottom: 10,
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#2f9fa6", // Cor da borda
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#2C2C2E", // Cor de fundo
  },
  paisHeader: {
    flexDirection: "row", // Alinha a bandeira e o nome do país em linha
    alignItems: "center", // Alinha os itens verticalmente no centro
  },
  paisTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10, // Espaço entre a bandeira e o nome do país
    color: "#fff", // Cor do texto
  },
});

export default CompeticoesPorPaisComponent;
