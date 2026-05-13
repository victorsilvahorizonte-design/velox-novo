import { INFRA_PISTA } from "./pista";
import { INFRA_FAIXA } from "./faixa";
import { INFRA_RESA } from "./resa";
import { INFRA_TAXIWAY } from "./taxiway";
import { INFRA_SINALIZACAO } from "./sinalizacao";
import { INFRA_DRENAGEM } from "./drenagem";

export const INFRA_CHECKLIST = [
  ...INFRA_PISTA,
  ...INFRA_FAIXA,
  ...INFRA_RESA,
  ...INFRA_TAXIWAY,
  ...INFRA_SINALIZACAO,
  ...INFRA_DRENAGEM,
];

export default INFRA_CHECKLIST;