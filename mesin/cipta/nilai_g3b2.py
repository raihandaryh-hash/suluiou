#!/usr/bin/env python3
"""Nilai G3b.2 mode dewasa. (1) Kalibrasi juri: vonis juri pada KAL (tanpa label) dibandingkan label beku → TPR (GAGAL tertangkap)
dan TNR (LULUS dibiarkan); aturan ambang rencana: ≥96 dari 100 positif dan ≥92 dari 100 negatif. (2) Bila juri lulus kalibrasi,
hitung giliran AI simulasi yang dinilai GAGAL; gerbang: ≤5 dari 100.
Pakai: python3 nilai_g3b2.py KAL_berlabel.jsonl VONIS_KAL.jsonl [VONIS_SIM.jsonl]"""
import json, sys
L = lambda f: {json.loads(l)["id"]: json.loads(l) for l in open(f, encoding="utf-8") if l.strip()}
kal, vk = L(sys.argv[1]), L(sys.argv[2])
hilang = [i for i in kal if i not in vk]
tp = sum(kal[i]["label"] == "GAGAL" and vk[i]["vonis"] == "GAGAL" for i in kal if i in vk)
tn = sum(kal[i]["label"] == "LULUS" and vk[i]["vonis"] == "LULUS" for i in kal if i in vk)
P = sum(x["label"] == "GAGAL" for x in kal.values()); N = len(kal) - P
lulus_kal = tp >= 96 * P / 100 and tn >= 92 * N / 100 and not hilang
sul = [i for i in kal if kal[i].get("jenis_sulit") and i in vk and vk[i]["vonis"] != kal[i]["label"]]
print(f"Kalibrasi: TPR {tp}/{P}, TNR {tn}/{N}, tanpa vonis {len(hilang)}; salah pada kasus sulit {len(sul)} → {'LULUS' if lulus_kal else 'GAGAL'}")
if len(sys.argv) > 3:
    vs = L(sys.argv[3]); g = sum(v["vonis"] == "GAGAL" for v in vs.values())
    print(f"Simulasi: {g} dari {len(vs)} giliran AI dinilai memuat solusi langsung → G3b.2 dewasa {'LULUS' if lulus_kal and g <= 5 and len(vs) >= 100 else ('BELUM SAH (juri belum lulus kalibrasi)' if not lulus_kal else 'GAGAL')}")
