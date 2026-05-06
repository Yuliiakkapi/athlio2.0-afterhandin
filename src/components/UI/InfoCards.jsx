import "./InfoCards.css";

function CardInfoSingle() {
  return (
    <div className="card-info-single">
      <div className="card-info-content">
        <div className="info-row">
          <div className="info-field">
            <div className="info-label">Nationality</div>
            <div className="info-value-with-icon">
              <img
                src="https://api.builder.io/api/v1/image/assets/e9cac1e18ae64186984fb4d639c633bc/72e69b03d4059a53de512c10376615fb6936daa7?placeholderIfAbsent=true"
                alt="Australia flag"
                className="info-icon"
              />
              <div>Australia</div>
            </div>
          </div>
          <div className="info-field">
            <div className="info-label">2008/02/27</div>
            <div className="info-value">
              <div>17 years</div>
            </div>
          </div>
          <div className="info-field">
            <div className="info-label">Team</div>
            <div className="info-value">
              <div className="info-value-with-icon">
                <img
                  src="https://api.builder.io/api/v1/image/assets/e9cac1e18ae64186984fb4d639c633bc/689dacea14a58095002249817e47a403c4fd8652?placeholderIfAbsent=true"
                  alt="CCM logo"
                  className="info-icon"
                />
                <div>CCM</div>
              </div>
            </div>
          </div>
        </div>
        <div className="info-row">
          <div className="info-field">
            <div className="info-label">Weight(kg)</div>
            <div className="info-value">
              <div>72</div>
            </div>
          </div>
          <div className="info-field">
            <div className="info-label">Height(cm)</div>
            <div className="info-value">
              <div>181</div>
            </div>
          </div>
          <div className="info-field">
            <div className="info-label">Position</div>
            <div className="info-value">
              <div>CM</div>
            </div>
          </div>
        </div>
        <div className="info-row">
          <div className="info-field">
            <div className="info-label">Shirt Number</div>
            <div className="info-value">
              <div>#8</div>
            </div>
          </div>
          <div className="info-field">
            <div className="info-label">Preferred Foot</div>
            <div className="info-value">
              <div>Right</div>
            </div>
          </div>
          <div className="info-field">
            <div className="info-label">Market Value</div>
            <div className="info-value">
              <div>350k€</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardInfoSingle;
