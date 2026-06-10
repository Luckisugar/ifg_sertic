import Component from "./styleTopo.styles";

export default function Topo(props: any) {
  return (
    <Component>
      <div className="container">
        <i>{props.icon}</i>
        <h3>{props.name}</h3>
      </div>
    </Component>
  );
}
