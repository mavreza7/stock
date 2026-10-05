"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      setError(error.message);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const totalProduk = products.length;

  const totalStok = products.reduce(
    (total, item) => total + Number(item.stock || 0),
    0
  );

  const stokMenipis = products.filter(
    (item) =>
      Number(item.stock || 0) <= Number(item.minimum_stock || 0)
  ).length;

  const nilaiStok = products.reduce(
    (total, item) =>
      total +
      Number(item.stock || 0) * Number(item.cost_price || 0),
    0
  );

  return (
    <main className="page">
      <div className="container">

        {/* HEADER */}
        <header className="header">
          <div>
            <div className="brand">AMANAH DIGITAL PRINTING</div>
            <h1>Sistem Manajemen Stok</h1>
            <p>
              Kelola produk, persediaan dan transaksi percetakan
              dari satu tempat.
            </p>
          </div>

          <button className="refreshButton" onClick={loadProducts}>
            ↻ Refresh
          </button>
        </header>

        {/* MENU */}
        <nav className="menu">
          <button className="menuActive">Dashboard</button>
          <button>Produk</button>
          <button>Stok Masuk</button>
          <button>Stok Keluar</button>
          <button>Penjualan</button>
          <button>Laporan</button>
        </nav>

        {/* JUDUL */}
        <section className="sectionTitle">
          <div>
            <h2>Dashboard</h2>
            <p>Ringkasan kondisi stok saat ini</p>
          </div>
        </section>

        {/* CARDS */}
        <section className="cards">

          <div className="card">
            <div className="cardIcon blue">📦</div>
            <div>
              <span>Total Produk</span>
              <strong>{totalProduk}</strong>
              <small>Produk aktif</small>
            </div>
          </div>

          <div className="card">
            <div className="cardIcon green">📊</div>
            <div>
              <span>Total Stok</span>
              <strong>{totalStok}</strong>
              <small>Seluruh persediaan</small>
            </div>
          </div>

          <div className="card">
            <div className="cardIcon orange">⚠️</div>
            <div>
              <span>Stok Menipis</span>
              <strong>{stokMenipis}</strong>
              <small>Perlu diperhatikan</small>
            </div>
          </div>

          <div className="card">
            <div className="cardIcon purple">💰</div>
            <div>
              <span>Nilai Stok</span>
              <strong>
                Rp {nilaiStok.toLocaleString("id-ID")}
              </strong>
              <small>Berdasarkan harga modal</small>
            </div>
          </div>

        </section>

        {/* QUICK ACTION */}
        <section className="quickSection">
          <h2>Aksi Cepat</h2>

          <div className="quickGrid">
            <button className="quickCard">
              <span>📦</span>
              <div>
                <strong>Tambah Produk</strong>
                <small>Masukkan produk baru</small>
              </div>
            </button>

            <button className="quickCard">
              <span>📥</span>
              <div>
                <strong>Stok Masuk</strong>
                <small>Tambah persediaan</small>
              </div>
            </button>

            <button className="quickCard">
              <span>📤</span>
              <div>
                <strong>Stok Keluar</strong>
                <small>Kurangi persediaan</small>
              </div>
            </button>

            <button className="quickCard">
              <span>🛒</span>
              <div>
                <strong>Penjualan</strong>
                <small>Catat transaksi penjualan</small>
              </div>
            </button>
          </div>
        </section>

        {/* PRODUK */}
        <section className="tableSection">

          <div className="tableHeader">
            <div>
              <h2>Master Produk</h2>
              <p>Produk yang tersimpan di database Supabase</p>
            </div>

            <span className="productCount">
              {totalProduk} Produk
            </span>
          </div>

          {loading && (
            <div className="message">
              ⏳ Mengambil data produk...
            </div>
          )}

          {error && (
            <div className="error">
              ❌ Gagal mengambil data:
              <br />
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="message">
              Belum ada produk aktif.
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Kategori</th>
                    <th>Material</th>
                    <th>Satuan</th>
                    <th>Harga Jual</th>
                    <th>Stok</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {

                    const stock = Number(product.stock || 0);
                    const minimum = Number(
                      product.minimum_stock || 0
                    );

                    const lowStock = stock <= minimum;

                    return (
                      <tr key={product.id}>

                        <td>
                          <strong>{product.name}</strong>
                        </td>

                        <td>
                          {product.category || "-"}
                        </td>

                        <td>
                          {product.material || "-"}
                        </td>

                        <td>
                          {product.unit || "pcs"}
                        </td>

                        <td>
                          Rp{" "}
                          {Number(
                            product.selling_price || 0
                          ).toLocaleString("id-ID")}
                        </td>

                        <td>
                          <strong
                            className={
                              lowStock
                                ? "stockLow"
                                : "stockGood"
                            }
                          >
                            {stock}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={
                              lowStock
                                ? "badge danger"
                                : "badge success"
                            }
                          >
                            {lowStock
                              ? "Stok Menipis"
                              : "Stok Aman"}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </section>

        {/* FOOTER */}
        <footer>
          Sistem Stok Percetakan • Terhubung dengan Supabase
        </footer>

      </div>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #f4f6f9;
          color: #172033;
          font-family: Arial, Helvetica, sans-serif;
        }

        .container {
          width: 100%;
          max-width: 1400px;
          margin: auto;
          padding: 30px;
        }

        .header {
          background: #111827;
          color: white;
          padding: 30px;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .brand {
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 2px;
          opacity: .75;
          margin-bottom: 8px;
        }

        .header h1 {
          margin: 0;
          font-size: 30px;
        }

        .header p {
          margin: 8px 0 0;
          color: #cbd5e1;
        }

        .refreshButton {
          border: 0;
          background: white;
          color: #111827;
          padding: 12px 18px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
        }

        .menu {
          margin: 20px 0;
          background: white;
          border-radius: 14px;
          padding: 8px;
          display: flex;
          gap: 6px;
          overflow-x: auto;
          box-shadow: 0 3px 15px rgba(0,0,0,.05);
        }

        .menu button {
          border: 0;
          background: transparent;
          padding: 12px 18px;
          border-radius: 9px;
          cursor: pointer;
          white-space: nowrap;
          font-weight: 600;
          color: #64748b;
        }

        .menu .menuActive {
          background: #111827;
          color: white;
        }

        .sectionTitle {
          margin: 28px 0 18px;
        }

        .sectionTitle h2,
        .quickSection h2,
        .tableHeader h2 {
          margin: 0;
          font-size: 22px;
        }

        .sectionTitle p,
        .tableHeader p {
          color: #64748b;
          margin: 6px 0 0;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .card {
          background: white;
          padding: 22px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 3px 15px rgba(0,0,0,.05);
        }

        .cardIcon {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
        }

        .blue {
          background: #dbeafe;
        }

        .green {
          background: #dcfce7;
        }

        .orange {
          background: #ffedd5;
        }

        .purple {
          background: #ede9fe;
        }

        .card span {
          display: block;
          color: #64748b;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .card strong {
          display: block;
          font-size: 23px;
        }

        .card small {
          display: block;
          color: #94a3b8;
          margin-top: 5px;
        }

        .quickSection {
          margin-top: 30px;
        }

        .quickGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 15px;
        }

        .quickCard {
          border: 0;
          background: white;
          padding: 20px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 15px;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 3px 15px rgba(0,0,0,.05);
        }

        .quickCard > span {
          font-size: 28px;
        }

        .quickCard strong {
          display: block;
        }

        .quickCard small {
          display: block;
          color: #64748b;
          margin-top: 5px;
        }

        .tableSection {
          background: white;
          margin-top: 30px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 3px 15px rgba(0,0,0,.05);
        }

        .tableHeader {
          padding: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .productCount {
          background: #f1f5f9;
          padding: 8px 13px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: bold;
        }

        .tableWrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f8fafc;
          color: #64748b;
          text-align: left;
          font-size: 13px;
          padding: 15px 20px;
          white-space: nowrap;
        }

        td {
          padding: 16px 20px;
          border-top: 1px solid #eef2f7;
          white-space: nowrap;
        }

        .stockGood {
          color: #16a34a;
        }

        .stockLow {
          color: #dc2626;
        }

        .badge {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .success {
          background: #dcfce7;
          color: #15803d;
        }

        .danger {
          background: #fee2e2;
          color: #b91c1c;
        }

        .message {
          padding: 30px;
          color: #64748b;
          text-align: center;
        }

        .error {
          margin: 20px;
          padding: 16px;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 10px;
        }

        footer {
          text-align: center;
          color: #94a3b8;
          padding: 30px 0 10px;
          font-size: 13px;
        }

        @media (max-width: 1000px) {

          .cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .quickGrid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 650px) {

          .container {
            padding: 15px;
          }

          .header {
            padding: 22px;
            flex-direction: column;
            align-items: flex-start;
          }

          .header h1 {
            font-size: 24px;
          }

          .cards,
          .quickGrid {
            grid-template-columns: 1fr;
          }

        }

      `}</style>
    </main>
  );
}
