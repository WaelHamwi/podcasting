declare module '@xixixao/uploadstuff' {
    export type UploadButtonProps = {
      className?: string | ((state: any) => string);
    };
  
    export function UploadButton(props: UploadButtonProps): JSX.Element;
  }
  