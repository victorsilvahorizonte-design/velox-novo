import { RBAC153 } from "./rbac153/index.js";
import { RBAC154 } from "./rbac154/index.js";
import { RBAC107 } from "./rbac107/index.js";

export const NORMAS = {
  RBAC153: {
    id: "RBAC153",
    nome: "RBAC 153",
    titulo: "Operação, Manutenção e Resposta à Emergência",
    itens: RBAC153,
  },

  RBAC154: {
    id: "RBAC154",
    nome: "RBAC 154",
    titulo: "Projeto de Aeródromos",
    itens: RBAC154,
  },

  RBAC107: {
    id: "RBAC107",
    nome: "RBAC 107",
    titulo: "Segurança da Aviação Civil contra Atos de Interferência Ilícita",
    itens: RBAC107,
  },
};

export default NORMAS;