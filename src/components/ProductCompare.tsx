import { CATEGORY_LABELS } from '../data/catalog'
import type { Recommendation } from '../lib/recommend'
import { trackAffiliateClick } from '../lib/tracking'

function formatPrice(eur: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(eur)
}

type Props = {
  recommendations: Recommendation[]
}

/** Side-by-side compare for 2–3 in-chat tips. */
export function ProductCompare({ recommendations }: Props) {
  const cols = recommendations.slice(0, 3)
  if (cols.length < 2) return null

  const cheapestId = cols.reduce((best, cur) =>
    cur.product.priceEur < best.product.priceEur ? cur : best,
  ).product.id

  return (
    <div className="compare" role="region" aria-label="Porovnanie tipov">
      <div className="compare-head">
        <p className="compare-title">Porovnanie tipov</p>
        <p className="compare-sub">Vedľa seba — cena, značka a dôvod</p>
      </div>

      <div className="compare-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col" className="compare-label">
                Parameter
              </th>
              {cols.map((rec, index) => (
                <th key={rec.product.id} scope="col" className="compare-col">
                  <span className="compare-rank">#{index + 1}</span>
                  <span className="compare-name">{rec.product.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Značka</th>
              {cols.map((rec) => (
                <td key={`${rec.product.id}-brand`}>{rec.product.brand}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Kategória</th>
              {cols.map((rec) => (
                <td key={`${rec.product.id}-cat`}>
                  {CATEGORY_LABELS[rec.product.category]}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Cena</th>
              {cols.map((rec) => (
                <td
                  key={`${rec.product.id}-price`}
                  className={
                    rec.product.id === cheapestId ? 'compare-price is-best' : 'compare-price'
                  }
                >
                  {formatPrice(rec.product.priceEur)}
                  {rec.product.id === cheapestId ? (
                    <span className="compare-badge">najlacnejší</span>
                  ) : null}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Prečo</th>
              {cols.map((rec) => (
                <td key={`${rec.product.id}-why`} className="compare-why">
                  {rec.reason}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">
                <span className="sr-only">Odkaz</span>
              </th>
              {cols.map((rec, index) => (
                <td key={`${rec.product.id}-cta`}>
                  <a
                    className="compare-cta"
                    href={rec.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() =>
                      trackAffiliateClick({
                        productId: rec.product.id,
                        productName: rec.product.name,
                        category: rec.product.category,
                        priceEur: rec.product.priceEur,
                        affiliateUrl: rec.affiliateUrl,
                        rank: index + 1,
                      })
                    }
                  >
                    Alza.sk
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
